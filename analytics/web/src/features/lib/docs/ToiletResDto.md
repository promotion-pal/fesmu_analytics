
# ToiletResDto


## Properties

Name | Type
------------ | -------------
`name` | string
`ratings` | [Array&lt;ToiletCreateRatingDto&gt;](ToiletCreateRatingDto.md)
`id` | number
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { ToiletResDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": Туалет в ТЦ "Европа",
  "ratings": null,
  "id": 1,
  "createdAt": 2024-01-15T10:30Z,
  "updatedAt": 2024-01-15T12:45Z,
} satisfies ToiletResDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ToiletResDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


