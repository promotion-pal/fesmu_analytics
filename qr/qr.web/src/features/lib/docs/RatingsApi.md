# RatingsApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiToiletsIdRatingsGet**](RatingsApi.md#apitoiletsidratingsget) | **GET** /api/toilets/{id}/ratings | Получить оценки туалета |
| [**apiToiletsIdRatingsPost**](RatingsApi.md#apitoiletsidratingspost) | **POST** /api/toilets/{id}/ratings | Добавить оценку туалету |



## apiToiletsIdRatingsGet

> Array&lt;ModelsToiletRating&gt; apiToiletsIdRatingsGet(id)

Получить оценки туалета

### Example

```ts
import {
  Configuration,
  RatingsApi,
} from '';
import type { ApiToiletsIdRatingsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RatingsApi();

  const body = {
    // number | ID туалета
    id: 56,
  } satisfies ApiToiletsIdRatingsGetRequest;

  try {
    const data = await api.apiToiletsIdRatingsGet(body);
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

### Return type

[**Array&lt;ModelsToiletRating&gt;**](ModelsToiletRating.md)

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


## apiToiletsIdRatingsPost

> ModelsToiletRating apiToiletsIdRatingsPost(id, rating)

Добавить оценку туалету

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

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

