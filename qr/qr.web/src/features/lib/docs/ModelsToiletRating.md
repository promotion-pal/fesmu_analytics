
# ModelsToiletRating


## Properties

Name | Type
------------ | -------------
`comment` | string
`conditionRoom` | number
`createdAt` | string
`id` | number
`soapAvailable` | boolean
`toiletId` | number

## Example

```typescript
import type { ModelsToiletRating } from ''

// TODO: Update the object below with actual values
const example = {
  "comment": Чисто, есть мыло,
  "conditionRoom": 8,
  "createdAt": 2026-05-11T10:00:00Z,
  "id": 1,
  "soapAvailable": true,
  "toiletId": 1,
} satisfies ModelsToiletRating

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ModelsToiletRating
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


