
# LectureHallRatingEntity


## Properties

Name | Type
------------ | -------------
`id` | number
`comment` | string
`createdAt` | Date
`updatedAt` | Date
`cleanliness` | number
`comfort` | number
`equipment` | number

## Example

```typescript
import type { LectureHallRatingEntity } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 1,
  "comment": Комментарий пользователя ...,
  "createdAt": 2024-01-15T10:30Z,
  "updatedAt": 2024-01-15T12:45Z,
  "cleanliness": 5,
  "comfort": 4,
  "equipment": 3,
} satisfies LectureHallRatingEntity

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as LectureHallRatingEntity
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


