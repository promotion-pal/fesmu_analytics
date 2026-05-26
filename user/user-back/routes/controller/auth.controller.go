package controller

import (
	"encoding/json"
	"net/http"
	"user-back/models"
	"user-back/routes/service"
)

type AuthHandler struct {
	authService *service.AuthService
	userService *service.UserService
}

func NewAuthHandler(authService *service.AuthService, userService *service.UserService) *AuthHandler {
	return &AuthHandler{authService: authService, userService: userService}
}

func (h *AuthHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /login", h.Login)
	mux.HandleFunc("POST /register", h.Register)
}

type TokensRes struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

// Login - GET /login
// @Summary      Авторизация пользователя
// @Description  Возвращает токены доступа при успешной авторизации
// @Tags         auth
// @Produce      json
// @Success      200 {object} TokensRes
// @Failure      500  {string}  string "Internal Server Error"
// @Router       /login [get]
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	accessToken, refreshToken, err := h.authService.GenerateTokens("example_user")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(TokensRes{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	})
}

// type RegisterDTO struct {
// 	models.UserBase
// }

type RegisterDTO struct {
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	Patronymic string `json:"patronymic"`
	Phone      string `json:"phone"`
	Password   string `json:"password"`
}

// Register - POST /register
// @Summary      Регистрация пользователя
// @Description  Создает нового пользователя и возвращает токены доступа
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        user  body      RegisterDTO  true  "Данные нового пользователя"
// @Success      201 {object} TokensRes
// @Failure      400  {string}  string "Invalid JSON"
// @Failure      500  {string}  string "Internal Server Error"
// @Router       /register [post]
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var dto RegisterDTO

	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	newUser := models.User{}

	if err := h.userService.Create(r.Context(), &newUser); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	accessToken, refreshToken, err := h.authService.GenerateTokens(dto.Phone)
	if err != nil {
		http.Error(w, "Ошибка генерации токенов", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	res := TokensRes{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}
	json.NewEncoder(w).Encode(res)
}
