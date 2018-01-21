# Coding Guidlines

## Naming

Function name: `functionNamesLikeThis`

Variables name : `variableNamesLikeThis`

Class names: `ClassNamesLikeThis`

Enum: `EnumNamesLikeThis`

Constant: `CONSTANT_VALUES_LIKE_THIS`

Private: properties and methods should be named with a trailing underscore

Protected/public:  properties and methods should be named without a trailing underscore

## Strings

Prefer `'` over `"`

For consistency single-quotes (') are preferred to double-quotes ("). This is helpful when creating strings that include HTML:

```javascript
var msg = 'This is some HTML';
```

## Functions
**Parameters**
Function parameters must be declated with its type:
```javascript
func(text: String, obj: Object ... ): Promise<*> {}
```
Function parameters must be typed with JSDoc annotations in the JSDoc preceding the function’s definition.

**Return value**
Functions return value type must be appear in the function declaration.
```javascript
func(text: String, obj: Object ... ): Promise<*> {}
```
Function return types must be specified in the JSDoc directly above the function definition.

**Arrow functions**
Prefer using arrow functions over `f.bind(this)`, and especially over `kalt.bind(f, this)`. Avoid writing `const self = this`. Arrow functions are particularly useful for callbacks, which sometimes pass unexpected additional arguments


## Braces

Braces are used for all control structures
Braces are required for all control structures (i.e. `if`, `else`, `for`, `do`, `while`, as well as any others), even if the body contains only a single statement. The first statement of a non-empty block must begin on its own line.

Illegal:
```javascript
if (someVeryLongCondition())
  doSomething();

for (let i = 0; i < foo.length; i++) bar(foo[i]);
```

## Block indentation

 +2 spaces. Each time a new block or block-like construct is opened, the indent increases by two spaces. When the block ends, the indent returns to the previous indent level. The indent level applies to both code and comments throughout the block.

## Flow

Type names should start with Capital letter (pascal case), i.e:

```javascript
type CategoryType = { [category: string]: number };
export type {CategoryType}
```

