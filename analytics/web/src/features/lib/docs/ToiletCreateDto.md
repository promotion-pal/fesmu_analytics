
# ToiletCreateDto


## Properties

Name | Type
------------ | -------------
`name` | string
`ratings` | [Array&lt;ToiletCreateRatingDto&gt;](ToiletCreateRatingDto.md)

## Example

```typescript
import type { ToiletCreateDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": Туалет в ТЦ "Европа",
  "ratings": null,
} satisfies ToiletCreateDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ToiletCreateDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


