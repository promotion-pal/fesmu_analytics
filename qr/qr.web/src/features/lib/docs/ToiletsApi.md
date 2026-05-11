# ToiletsApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiToiletsGet**](ToiletsApi.md#apitoiletsget) | **GET** /api/toilets | Получить список туалетов |



## apiToiletsGet

> Array&lt;ModelsToilet&gt; apiToiletsGet()

Получить список туалетов

### Example

```ts
import {
  Configuration,
  ToiletsApi,
} from '';
import type { ApiToiletsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ToiletsApi();

  try {
    const data = await api.apiToiletsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ModelsToilet&gt;**](ModelsToilet.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

