
# LectureHallRatingCreateDto


## Properties

Name | Type
------------ | -------------
`comment` | string
`cleanliness` | number
`comfort` | number
`equipment` | number

## Example

```typescript
import type { LectureHallRatingCreateDto } from ''

// TODO: Update the object below with actual values
const example = {
  "comment": Чисто, но нет бумаги,
  "cleanliness": 5,
  "comfort": 4,
  "equipment": 3,
} satisfies LectureHallRatingCreateDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as LectureHallRatingCreateDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


