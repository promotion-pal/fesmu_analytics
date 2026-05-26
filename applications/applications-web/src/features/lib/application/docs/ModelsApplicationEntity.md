
# ModelsApplicationEntity


## Properties

Name | Type
------------ | -------------
`category` | [ModelsApplicationCategory](ModelsApplicationCategory.md)
`createdAt` | string
`description` | string
`id` | number
`name` | string
`status` | string
`updatedAt` | string
`userId` | number

## Example

```typescript
import type { ModelsApplicationEntity } from ''

// TODO: Update the object below with actual values
const example = {
  "category": null,
  "createdAt": null,
  "description": null,
  "id": null,
  "name": null,
  "status": null,
  "updatedAt": null,
  "userId": null,
} satisfies ModelsApplicationEntity

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ModelsApplicationEntity
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


