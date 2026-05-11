
# AnalyticsCreate

Базовая DTO для Analytics

## Properties

Name | Type
------------ | -------------
`idToilet` | number
`soap` | boolean
`conditionRoom` | number
`test` | boolean

## Example

```typescript
import type { AnalyticsCreate } from ''

// TODO: Update the object below with actual values
const example = {
  "idToilet": null,
  "soap": null,
  "conditionRoom": null,
  "test": null,
} satisfies AnalyticsCreate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AnalyticsCreate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


