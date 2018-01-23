# Coding Guidelines

Use the following coding guidelines when creating and editing players:

## Naming

Use the following naming conventions:


| Convention        |Explanation | 
|------------ |------------------|
| Function name  | `functionNamesLikeThis` | 
| Variable name  | `variableNamesLikeThis` | 
| Class names | `ClassNamesLikeThis`|
|Enum   |   `EnumNamesLikeThis`|
|Constant| `CONSTANT_VALUES_LIKE_THIS`|
|Private | Private properties and methods should be named *with* a trailing underscore.|
|Protected/public | Protected/public properties and methods should be named *without* a trailing underscore.|

## Strings

Prefer `'` over `"`

For consistency's sake, single-quotes (') are preferrable to double-quotes ("). This is especially important when creating strings that include HTML:

```javascript
var msg = 'This is some HTML';
```

## Functions  

### Parameters  

Function parameters must be declated with their types:
```javascript
func(text: String, obj: Object ... ): Promise<*> {}
```
Function parameters must be typed with JSDoc annotations in the JSDoc preceding the function’s definition.

### Return Value  

The functions return value type *must* be appear in the function declaration: 
```javascript
func(text: String, obj: Object ... ): Promise<*> {}
```
The function return types must be specified in the JSDoc directly above the function definition.

### Arrow functions 

It's better to use arrow functions over `f.bind(this)`, and especially over `kalt.bind(f, this)`. Avoid writing `const self = this`. Arrow functions are particularly useful for callbacks, which sometimes pass unexpected additional arguments.


## Braces  

Braces are requires for all control structures (e.g., `if`, `else`, `for`, `do`, `while` as well as any others), even if the body contains only a single statement. The first statement of a non-empty block must begin in its own line.

>Important! Do **not** use the following structure:

```javascript
if (someVeryLongCondition())
  doSomething();

for (let i = 0; i < foo.length; i++) bar(foo[i]);
```

## Block indentation

Block indentation is +2 spaces. Each time a new block or block-like construct is opened, the indent increases by two spaces. When the block ends, the indent returns to the previous indent level. The indent level applies to both code and comments throughout the block.

## Flow

Type names must start with a Capital letter (pascal case), e.g.:

```javascript
type CategoryType = { [category: string]: number };
export type {CategoryType}
```

