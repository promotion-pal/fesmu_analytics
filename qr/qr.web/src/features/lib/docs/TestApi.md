# TestApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createRecordTestPost**](TestApi.md#createrecordtestpost) | **POST** /test/ | Create Record |
| [**fetchTestGet**](TestApi.md#fetchtestget) | **GET** /test/ | Fetch |



## createRecordTestPost

> any createRecordTestPost(testCreate)

Create Record

Добавление записи

### Example

```ts
import {
  Configuration,
  TestApi,
} from '';
import type { CreateRecordTestPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TestApi();

  const body = {
    // TestCreate
    testCreate: ...,
  } satisfies CreateRecordTestPostRequest;

  try {
    const data = await api.createRecordTestPost(body);
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
| **testCreate** | [TestCreate](TestCreate.md) |  | |

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


## fetchTestGet

> any fetchTestGet()

Fetch

Тестовый эндпоинт

### Example

```ts
import {
  Configuration,
  TestApi,
} from '';
import type { FetchTestGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TestApi();

  try {
    const data = await api.fetchTestGet();
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

