
# ToiletCreateRatingDto


## Properties

Name | Type
------------ | -------------
`smellRating` | number
`purityRating` | number
`hasToiletPaper` | boolean
`hasSoap` | boolean
`comment` | string

## Example

```typescript
import type { ToiletCreateRatingDto } from ''

// TODO: Update the object below with actual values
const example = {
  "smellRating": 4,
  "purityRating": 5,
  "hasToiletPaper": true,
  "hasSoap": false,
  "comment": Чисто, но нет бумаги,
} satisfies ToiletCreateRatingDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ToiletCreateRatingDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


