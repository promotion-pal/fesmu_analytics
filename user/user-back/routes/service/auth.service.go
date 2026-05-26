package service

import (
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

type AuthService struct {
	db *gorm.DB
}

func NewAuthService(db *gorm.DB) *AuthService {
	if db == nil {
		log.Println("⚠️ ВНИМАНИЕ: db равен nil")
	}
	return &AuthService{db: db}
}

// ---- TOKEN GENERATION ----

type TokenClaims struct {
	Login string `json:"login"`
	jwt.RegisteredClaims
}

func (h *AuthService) GenerateTokens(login string) (string, string, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "super_secret_fallback_key"
	}
	secretBytes := []byte(jwtSecret)

	accessClaims := &TokenClaims{
		Login: login,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	accessTokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessToken, err := accessTokenObj.SignedString(secretBytes)
	if err != nil {
		return "", "", err
	}

	refreshClaims := &TokenClaims{
		Login: login,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	refreshTokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshToken, err := refreshTokenObj.SignedString(secretBytes)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}
