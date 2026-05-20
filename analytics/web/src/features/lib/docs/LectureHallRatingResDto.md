
# LectureHallRatingResDto


## Properties

Name | Type
------------ | -------------
`cleanliness` | number
`comfort` | number
`equipment` | number
`id` | number
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { LectureHallRatingResDto } from ''

// TODO: Update the object below with actual values
const example = {
  "cleanliness": 5,
  "comfort": 4,
  "equipment": 3,
  "id": 1,
  "createdAt": 2024-01-15T10:30Z,
  "updatedAt": 2024-01-15T12:45Z,
} satisfies LectureHallRatingResDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as LectureHallRatingResDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


