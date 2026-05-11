# RatingsApi

All URIs are relative to *http://localhost:8000/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiToiletsIdRatingsPost**](RatingsApi.md#apitoiletsidratingspost) | **POST** /api/toilets/{id}/ratings | Добавить оценку туалету |



## apiToiletsIdRatingsPost

> ModelsToiletRating apiToiletsIdRatingsPost(id, rating)

Добавить оценку туалету

Добавляет новую оценку для указанного туалета

### Example

```ts
import {
  Configuration,
  RatingsApi,
} from '';
import type { ApiToiletsIdRatingsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RatingsApi();

  const body = {
    // number | ID туалета
    id: 56,
    // ModelsToiletRating | Данные оценки
    rating: ...,
  } satisfies ApiToiletsIdRatingsPostRequest;

  try {
    const data = await api.apiToiletsIdRatingsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | ID туалета | [Defaults to `undefined`] |
| **rating** | [ModelsToiletRating](ModelsToiletRating.md) | Данные оценки | |

### Return type

[**ModelsToiletRating**](ModelsToiletRating.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |
| **400** | Bad Request |  -  |
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

