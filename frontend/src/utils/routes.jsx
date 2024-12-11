const api = "http://localhost:3000/api";
const login = `${api}/auth/login`;
const fetchCategoriesApi = `${api}/inventory/category/all`;
const fetchItemsApi = `${api}/inventory/items/all`;
const fetchSuppliersApi = `${api}/inventory/suppliers/all`;
const fetchLocationsApi = `${api}/inventory`;
const createCategoryApi = `${api}/inventory/createCategory`;
const createSupplierApi = `${api}/inventory/createSupplier`;
const createLocationApi = `${api}/inventory/createLocation`;
const createItemApi = `${api}/inventory/createItem`;
const addToExisitingItem = `${api}/inventory/addToExistingItem`;
const sellItemsApi = `${api}/inventory/sellItems`;
const fetchTransactionsApi = `${api}/inventory/transactions/all`;

export {
  login,
  fetchCategoriesApi,
  fetchItemsApi,
  fetchSuppliersApi,
  fetchLocationsApi,
  createCategoryApi,
  createSupplierApi,
  createLocationApi,
  createItemApi,
  addToExisitingItem,
  sellItemsApi,
  fetchTransactionsApi,
};
