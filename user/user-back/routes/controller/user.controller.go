package controller

import (
	"encoding/json"
	"net/http"
	"strconv"

	model "user-back/models"
	"user-back/routes/service"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(service *service.UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /users", h.FetchAll)
	mux.HandleFunc("POST /users", h.Create)
	mux.HandleFunc("GET /users/{id}", h.GetByID)
	mux.HandleFunc("PUT /users/{id}", h.Update)
	mux.HandleFunc("DELETE /users/{id}", h.Delete)
	mux.HandleFunc("GET /users/email/{email}", h.GetByEmail)
	mux.HandleFunc("PATCH /users/{id}/role", h.UpdateRole)
}

// FetchAll - GET /users
// @Summary      Получить список пользователей
// @Description  Возвращает массив всех зарегистрированных пользователей
// @Tags         users
// @Produce      json
// @Success      200  {array}   model.User
// @Failure      500  {string}  string "Internal Server Error"
// @Router       /users [get]
func (h *UserHandler) FetchAll(w http.ResponseWriter, r *http.Request) {
	users, err := h.service.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// Create - POST /users
// @Summary      Создать пользователя
// @Description  Регистрирует нового пользователя. Поля name, email и password обязательны.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        user  body      model.User  true  "Данные нового пользователя"
// @Success      201   {object}  model.User
// @Failure      400   {string}  string "Invalid JSON или пустые обязательные поля"
// @Failure      500   {string}  string "Internal Server Error"
// @Router       /users [post]
func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	var user model.User

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// if user.Name == "" || user.Email == "" || user.Password == "" {
	// 	http.Error(w, "Name, email and password are required", http.StatusBadRequest)
	// 	return
	// }

	if err := h.service.Create(r.Context(), &user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	user.Password = ""

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

// GetByID - GET /users/{id}
// @Summary      Получить пользователя по ID
// @Description  Возвращает профиль пользователя по его числовому идентификатору
// @Tags         users
// @Produce      json
// @Param        id   path      int  true  "Идентификатор пользователя"
// @Success      200  {object}  model.User
// @Failure      400  {string}  string "Invalid ID"
// @Failure      404  {string}  string "User Not Found"
// @Router       /users/{id} [get]
func (h *UserHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	user, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	user.Password = ""

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// GetByEmail - GET /users/email/{email}
// @Summary      Найти пользователя по Email
// @Description  Ищет и возвращает профиль пользователя по его электронной почте
// @Tags         users
// @Produce      json
// @Param        email  path      string  true  "Email адрес пользователя"
// @Success      200    {object}  model.User
// @Failure      400    {string}  string "Email is required"
// @Failure      404    {string}  string "User Not Found"
// @Router       /users/email/{email} [get]
func (h *UserHandler) GetByEmail(w http.ResponseWriter, r *http.Request) {
	email := r.PathValue("email")
	if email == "" {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}

	user, err := h.service.GetByEmail(r.Context(), email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	user.Password = ""

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// Update - PUT /users/{id}
// @Summary      Обновить профиль пользователя
// @Description  Полностью обновляет информацию о пользователе по его ID
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id    path      int         true  "Идентификатор пользователя"
// @Param        user  body      model.User  true  "Новые данные пользователя"
// @Success      200   {object}  map[string]string "{"status": "updated"}"
// @Failure      400   {string}  string "Invalid ID или Invalid JSON"
// @Failure      500   {string}  string "Internal Server Error"
// @Router       /users/{id} [put]
func (h *UserHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var user model.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if err := h.service.Update(r.Context(), id, &user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}

// Delete - DELETE /users/{id}
// @Summary      Удалить пользователя
// @Description  Удаляет запись о пользователе из базы данных по его ID
// @Tags         users
// @Produce      json
// @Param        id   path      int  true  "Идентификатор пользователя"
// @Success      200  {object}  map[string]string "{"status": "deleted"}"
// @Failure      400  {string}  string "Invalid ID"
// @Failure      500  {string}  string "Internal Server Error"
// @Router       /users/{id} [delete]
func (h *UserHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.service.Delete(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}

// UpdateRole - PATCH /users/{id}/role
// @Summary      Обновить роль пользователя
// @Description  Частичное обновление: изменяет только роль пользователя (например, admin, user)
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id    path      int  true  "Идентификатор пользователя"
// @Param        role  body      string  true  "JSON вида {"role": "admin"}"
// @Success      200   {object}  map[string]string "{"status": "role updated"}"
// @Failure      400   {string}  string "Invalid ID, Invalid JSON или пустая роль"
// @Failure      500   {string}  string "Internal Server Error"
// @Router       /users/{id}/role [patch]
func (h *UserHandler) UpdateRole(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var req struct {
		Role string `json:"role"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Role == "" {
		http.Error(w, "Role is required", http.StatusBadRequest)
		return
	}

	if err := h.service.UpdateRole(r.Context(), id, req.Role); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "role updated"})
}
