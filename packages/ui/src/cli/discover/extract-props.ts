import type ts from "typescript"

export interface ExtractedComponent {
  /** PascalCase name as declared (e.g. "HeaderPage"). */
  name: string
  /** Set of prop names on the component's first parameter type. */
  props: Set<string>
}

/** Walk a SourceFile for top-level exported React components and return their
 *  prop name sets. Supports:
 *   - `function Foo(props: Props) { ... }`
 *   - `export function Foo(props: Props) { ... }`
 *   - `export default function Foo(props: Props) { ... }`
 *   - `const Foo = (props: Props) => ...`
 *   - `const Foo: FC<Props> = (props) => ...`
 *   - `const Foo: React.FC<Props> = (props) => ...`
 *
 *  Does NOT (yet) support: `forwardRef` wrappers, anonymous default exports,
 *  HOCs that re-wrap a component. Those return an empty prop set and the
 *  caller filters them out. The fixture and most real-world DS-shadow shapes
 *  fall into the supported cases. */
export function extractComponents(
  tsApi: typeof ts,
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
): ExtractedComponent[] {
  // Pass 1: collect names from trailing `export { Foo, Bar }` statements and
  // from `export default Foo` references. DS components commonly use the
  // bottom-of-file `export { Header }` pattern instead of inline export, so
  // a naive inline-only check misses them entirely.
  const trailingExports = collectTrailingExports(tsApi, sourceFile)

  // Pass 2: walk statements, including any function/var that's either marked
  // export inline OR named in a trailing export.
  const out: ExtractedComponent[] = []
  for (const stmt of sourceFile.statements) {
    if (tsApi.isFunctionDeclaration(stmt)) {
      const candidate = extractFromFunction(tsApi, stmt, checker, trailingExports)
      if (candidate) out.push(candidate)
      continue
    }
    if (tsApi.isVariableStatement(stmt)) {
      const inlineExported = isExported(tsApi, stmt)
      for (const decl of stmt.declarationList.declarations) {
        const name = tsApi.isIdentifier(decl.name) ? decl.name.text : null
        const isReached =
          inlineExported || (name !== null && trailingExports.has(name))
        if (!isReached) continue
        const candidate = extractFromVariable(tsApi, decl, checker)
        if (candidate) out.push(candidate)
      }
    }
  }

  return out
}

/** Walk a SourceFile for `export { A, B as C }` and `export default D`
 *  statements; return the set of LOCAL names that get exported (the
 *  `propertyName` side of the specifier when an alias is present, otherwise
 *  the `name` side). Imported re-exports — `export { X } from "./y"` — are
 *  ignored because they don't refer to a local declaration in this file. */
function collectTrailingExports(tsApi: typeof ts, sourceFile: ts.SourceFile): Set<string> {
  const out = new Set<string>()
  for (const stmt of sourceFile.statements) {
    // `export { Foo, Bar as Baz }`  ← we want Foo and Bar (the LOCAL names).
    if (tsApi.isExportDeclaration(stmt)) {
      if (stmt.moduleSpecifier) continue // `export { X } from "./y"` — not local.
      const clause = stmt.exportClause
      if (clause && tsApi.isNamedExports(clause)) {
        for (const spec of clause.elements) {
          // spec.propertyName is the local name in `X as Y`; spec.name otherwise.
          const localName = (spec.propertyName ?? spec.name).text
          out.add(localName)
        }
      }
      continue
    }
    // `export default Foo` where Foo is a local identifier.
    if (tsApi.isExportAssignment(stmt) && !stmt.isExportEquals) {
      if (tsApi.isIdentifier(stmt.expression)) {
        out.add(stmt.expression.text)
      }
    }
  }
  return out
}

function isExported(tsApi: typeof ts, node: ts.Node): boolean {
  // ts.canHaveModifiers + getModifiers is the supported API path on modern TS.
  if (!tsApi.canHaveModifiers(node)) return false
  const mods = tsApi.getModifiers(node) ?? []
  return mods.some((m) => m.kind === tsApi.SyntaxKind.ExportKeyword)
}

function startsWithUppercase(name: string): boolean {
  return name.length > 0 && name[0] >= "A" && name[0] <= "Z"
}

function extractFromFunction(
  tsApi: typeof ts,
  fn: ts.FunctionDeclaration,
  checker: ts.TypeChecker,
  trailingExports: Set<string>,
): ExtractedComponent | null {
  const name = fn.name?.text
  if (!name || !startsWithUppercase(name)) return null
  if (!isExported(tsApi, fn) && !trailingExports.has(name)) return null
  const param = fn.parameters[0]
  if (!param) return null
  const props = collectPropNames(tsApi, param, checker)
  if (!props || props.size === 0) return null
  return { name, props }
}

function extractFromVariable(
  tsApi: typeof ts,
  decl: ts.VariableDeclaration,
  checker: ts.TypeChecker,
): ExtractedComponent | null {
  if (!tsApi.isIdentifier(decl.name)) return null
  const name = decl.name.text
  if (!startsWithUppercase(name)) return null

  // Find the function-like initializer. We accept arrow functions and
  // function expressions; anything else (object literal, JSX expression, etc.)
  // we treat as not-a-component.
  const init = decl.initializer
  if (!init) return null
  let fnNode: ts.ArrowFunction | ts.FunctionExpression | null = null
  if (tsApi.isArrowFunction(init) || tsApi.isFunctionExpression(init)) {
    fnNode = init
  } else if (tsApi.isCallExpression(init)) {
    // Unwrap one level of memo()/forwardRef()/observer() if the arg is a fn.
    // We don't try to pull props out of the call's type arguments — too many
    // shapes; a future enhancement could parse forwardRef<Ref, Props> explicitly.
    const arg = init.arguments[0]
    if (arg && (tsApi.isArrowFunction(arg) || tsApi.isFunctionExpression(arg))) {
      fnNode = arg
    } else {
      return null
    }
  } else {
    return null
  }

  // Case A: `const Foo: FC<Props> = (props) => ...`
  // The parameter has no explicit type annotation; the type comes from the
  // declaration's type annotation. Ask the checker for the parameter symbol's
  // type — it resolves through FC<Props> to give us the Props members.
  //
  // Case B: `const Foo = (props: Props) => ...`
  // The parameter has its own type annotation; same getTypeAtLocation call
  // works because it returns the resolved type of the parameter symbol.
  const param = fnNode.parameters[0]
  if (!param) return null
  const props = collectPropNames(tsApi, param, checker)
  if (!props || props.size === 0) return null
  return { name, props }
}

/** Given a parameter node, return the names of all properties on its type.
 *  Returns null if the parameter type can't be resolved or is something
 *  uninteresting (any, primitive, etc.). */
function collectPropNames(
  tsApi: typeof ts,
  param: ts.ParameterDeclaration,
  checker: ts.TypeChecker,
): Set<string> | null {
  // Prefer the parameter's symbol type — handles both annotated and inferred
  // (via the declaration's type) cases uniformly.
  const symbol = checker.getSymbolAtLocation(param.name)
  let type: ts.Type | undefined
  if (symbol) {
    type = checker.getTypeOfSymbolAtLocation(symbol, param)
  } else {
    type = checker.getTypeAtLocation(param)
  }
  if (!type) return null

  const props = type.getProperties()
  if (!props || props.length === 0) return null

  const out = new Set<string>()
  for (const propSymbol of props) {
    const propName = propSymbol.getName()
    // Skip TypeScript-internal names (start with __, e.g. __type).
    if (propName.startsWith("__")) continue
    out.add(propName)
  }
  return out
}
