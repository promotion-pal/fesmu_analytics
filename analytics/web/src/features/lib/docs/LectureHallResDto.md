
# LectureHallResDto


## Properties

Name | Type
------------ | -------------
`name` | string
`location` | string
`id` | number
`createdAt` | Date
`updatedAt` | Date
`ratings` | [Array&lt;LectureHallRatingEntity&gt;](LectureHallRatingEntity.md)

## Example

```typescript
import type { LectureHallResDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": ТЦ "Европа",
  "location": first_building,
  "id": 1,
  "createdAt": 2024-01-15T10:30Z,
  "updatedAt": 2024-01-15T12:45Z,
  "ratings": null,
} satisfies LectureHallResDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as LectureHallResDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


