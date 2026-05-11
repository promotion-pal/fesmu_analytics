# AnalyticsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createAnalyticsAnalyticsPost**](AnalyticsApi.md#createanalyticsanalyticspost) | **POST** /analytics/ | Create Analytics |
| [**fetchAllAnalyticsGet**](AnalyticsApi.md#fetchallanalyticsget) | **GET** /analytics/ | Fetch All |



## createAnalyticsAnalyticsPost

> any createAnalyticsAnalyticsPost(analyticsCreate)

Create Analytics

Добаление отзыва

### Example

```ts
import {
  Configuration,
  AnalyticsApi,
} from '';
import type { CreateAnalyticsAnalyticsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  const body = {
    // AnalyticsCreate
    analyticsCreate: ...,
  } satisfies CreateAnalyticsAnalyticsPostRequest;

  try {
    const data = await api.createAnalyticsAnalyticsPost(body);
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
| **analyticsCreate** | [AnalyticsCreate](AnalyticsCreate.md) |  | |

### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## fetchAllAnalyticsGet

> any fetchAllAnalyticsGet()

Fetch All

Получение аналитики

### Example

```ts
import {
  Configuration,
  AnalyticsApi,
} from '';
import type { FetchAllAnalyticsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  try {
    const data = await api.fetchAllAnalyticsGet();
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

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

