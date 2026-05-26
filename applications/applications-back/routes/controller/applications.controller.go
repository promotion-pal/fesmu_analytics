package application_controller

import (
	"encoding/json"
	"net/http"
	"strconv"

	"applications-back/routes/service"
)

type ApplicationHandler struct {
	service *service.ApplicationService
}

func NewApplicationHandler(service *service.ApplicationService) *ApplicationHandler {
	return &ApplicationHandler{service: service}
}

func (h *ApplicationHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /applications", h.FetchAll)
	mux.HandleFunc("POST /applications", h.Create)
	mux.HandleFunc("GET /applications/{id}", h.GetByID)
	mux.HandleFunc("PUT /applications/{id}", h.Update)
	mux.HandleFunc("DELETE /applications/{id}", h.Delete)
}

// FetchAll - GET /applications
// @Summary      Получить список всех заявок
// @Description  Возвращает массив всех поданных заявок в системе
// @Tags         applications
// @Security     BearerAuth
// @Produce      json
// @Success      200  {array}   models.ApplicationEntity // Предполагается, что модель ответа описана в вашем пакете моделей
// @Failure      401  {string}  string "Missing or invalid token"
// @Failure      500  {string}  string "Internal Server Error"
// @Router       /applications [get]
func (h *ApplicationHandler) FetchAll(w http.ResponseWriter, r *http.Request) {
	apps, err := h.service.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apps)
}

// Create - POST /applications
// @Summary      Создать новую заявку
// @Description  Принимает данные заявки и привязывает её к текущему авторизованному пользователю
// @Tags         applications
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        application  body      service.ApplicationCreateDto  true  "Данные для создания заявки"
// @Success      201          {object}  service.ApplicationCreateDto
// @Failure      400          {string}  string "Invalid JSON или неверные параметры"
// @Failure      401          {string}  string "Missing or invalid token"
// @Failure      500          {string}  string "Internal Server Error"
// @Router       /applications [post]
func (h *ApplicationHandler) Create(w http.ResponseWriter, r *http.Request) {
	var app service.ApplicationCreateDto

	if err := json.NewDecoder(r.Body).Decode(&app); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if err := h.service.Create(r.Context(), app); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(app)
}

// GetByID - GET /applications/{id}
// @Summary      Получить заявку по ID
// @Description  Возвращает полную информацию о конкретной заявке по её идентификатору
// @Tags         applications
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      int  true  "Идентификатор заявки"
// @Success      200  {object}  models.ApplicationEntity
// @Failure      400  {string}  string "Invalid ID"
// @Failure      404  {string}  string "Application not found"
// @Router       /applications/{id} [get]
func (h *ApplicationHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	app, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(app)
}

// Update - PUT /applications/{id}
// @Summary      Обновить данные заявки
// @Description  Полностью перезаписывает информацию в существующей заявке по её ID
// @Tags         applications
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id           path      int                           true  "Идентификатор заявки"
// @Param        application  body      service.ApplicationCreateDto  true  "Новые данные заявки"
// @Success      200          {object}  map[string]string "{"status": "updated"}"
// @Failure      400          {string}  string "Invalid ID или Invalid JSON"
// @Failure      500          {string}  string "Internal Server Error"
// @Router       /applications/{id} [put]
func (h *ApplicationHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var app service.ApplicationCreateDto
	if err := json.NewDecoder(r.Body).Decode(&app); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if err := h.service.Update(r.Context(), id, app); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}

// Delete - DELETE /applications/{id}
// @Summary      Удалить заявку
// @Description  Удаляет запись о заявке из базы данных по её уникальному ID
// @Tags         applications
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      int  true  "Идентификатор заявки"
// @Success      200  {object}  map[string]string "{"status": "deleted"}"
// @Failure      400  {string}  string "Invalid ID"
// @Failure      500  {string}  string "Internal Server Error"
// @Router       /applications/{id} [delete]
func (h *ApplicationHandler) Delete(w http.ResponseWriter, r *http.Request) {
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
