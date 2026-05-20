import {
  CreateParams,
  DeleteParams,
  UpdateParams,
  GetOneParams,
  GetManyParams,
  GetManyReferenceParams,
  fetchUtils,
  DataProvider,
  GetListParams,
} from "react-admin";
import { ENV } from "../../../shared/config/env";

export const API_URL = ENV.API;

const httpClient = fetchUtils.fetchJson;

const hasFiles = (data: any): boolean => {
  return Object.keys(data).some((key) => {
    const value = data[key];
    return (
      value &&
      (value.rawFile instanceof File ||
        (Array.isArray(value) &&
          value.some((item) => item.rawFile instanceof File)))
    );
  });
};

const convertToFormData = (data: any): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value && value.rawFile instanceof File) {
      formData.append(key, value.rawFile, value.title);
    } else if (
      Array.isArray(value) &&
      value.some((item) => item.rawFile instanceof File)
    ) {
      value.forEach((item, index) => {
        if (item.rawFile instanceof File) {
          formData.append(`${key}[${index}]`, item.rawFile, item.title);
        }
      });
    } else {
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : value,
      );
    }
  });

  return formData;
};

export const dataProvider: Omit<DataProvider, "deleteMany"> = {
  getList: async (resource: string, params: GetListParams) => {
    const queryParams = new URLSearchParams();

    Object.keys(params.filter).forEach((key) => {
      queryParams.append(key, params.filter[key]);
    });

    const url = `${API_URL}/${resource}?${queryParams.toString()}`;

    return httpClient(url).then(({ json }) => {
      console.log(json);

      return {
        data: json,
        total: json.length,
      };
    });
  },

  getOne: async (resource: string, params: GetOneParams) => {
    const url = `${API_URL}/${resource}/${params.id}`;

    const { json } = await httpClient(url);
    return { data: json };
  },

  getMany: async (resource: string, params: GetManyParams) => {
    const url = `${API_URL}/${resource}?ids=${params.ids.join(",")}`;

    const { json } = await httpClient(url);
    return { data: json };
  },

  getManyReference: async (
    resource: string,
    params: GetManyReferenceParams,
  ) => {
    const query = new URLSearchParams();

    query.append(
      "_start",
      String((params.pagination.page - 1) * params.pagination.perPage),
    );
    query.append(
      "_end",
      String(params.pagination.page * params.pagination.perPage),
    );

    if (params.sort && params.sort.field) {
      query.append("_sort", params.sort.field);
      query.append("_order", params.sort.order.toLowerCase());
    }

    const url = `${API_URL}/${resource}?${query.toString()}`;
    console.log("GET Many Reference:", url);

    const { json } = await httpClient(url);
    return {
      data: json,
      total: parseInt(json.length, 10),
    };
  },

  create: async (resource: string, params: CreateParams) => {
    console.log("CREATE:", resource, params.data);

    if (hasFiles(params.data)) {
      const formData = convertToFormData(params.data);

      const { json } = await httpClient(`${API_URL}/${resource}`, {
        method: "POST",
        body: formData,
      });
      return { data: json };
    } else {
      const { json } = await httpClient(`${API_URL}/${resource}`, {
        method: "POST",
        body: JSON.stringify(params.data),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      return { data: json };
    }
  },

  update: async (resource: string, params: UpdateParams) => {
    if (hasFiles(params.data)) {
      const formData = convertToFormData(params.data);
      const { json } = await httpClient(`${API_URL}/${resource}/${params.id}`, {
        method: "PUT",
        body: formData,
      });
      return { data: json };
    } else {
      const { json } = await httpClient(`${API_URL}/${resource}/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(params.data),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      return { data: json };
    }
  },

  delete: async (resource: string, params: DeleteParams) => {
    console.log("DELETE:", resource, params.id);

    await httpClient(`${API_URL}/${resource}/${params.id}`, {
      method: "DELETE",
    });
    return {
      data: {
        id: params.id,
        ...params.previousData,
      },
    };
  },

  // deleteMany: async (resource: string, params: DeleteManyParams) => {
  //   console.log("DELETE MANY:", resource, params.ids);

  //   await Promise.all(
  //     params.ids.map((id) =>
  //       httpClient(`${API_URL}/${resource}/${id}`, {
  //         method: "DELETE",
  //       }),
  //     ),
  //   );

  //   return { data: params.ids.map((id) => ({ id })) };
  // },
};
