package service

import (
	"context"
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	model "user-back/models"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	if db == nil {
		log.Println("⚠️ ВНИМАНИЕ: db равен nil")
	}
	return &UserService{db: db}
}

// GetAll - получает всех пользователей
func (s *UserService) GetAll(ctx context.Context) ([]model.User, error) {
	var users []model.User
	result := s.db.WithContext(ctx).Find(&users)
	if result.Error != nil {
		return nil, fmt.Errorf("ошибка запроса: %w", result.Error)
	}

	log.Printf("📦 Найдено %d пользователей", len(users))
	return users, nil
}

// GetByID - получает пользователя по ID
func (s *UserService) GetByID(ctx context.Context, id int) (*model.User, error) {
	var user model.User
	result := s.db.WithContext(ctx).First(&user, id)
	if result.Error != nil {
		return nil, fmt.Errorf("пользователь с id %d не найден: %w", id, result.Error)
	}

	return &user, nil
}

// GetByEmail - получает пользователя по email
func (s *UserService) GetByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User
	result := s.db.WithContext(ctx).Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, fmt.Errorf("пользователь с email %s не найден: %w", email, result.Error)
	}

	return &user, nil
}

// Create - создаёт нового пользователя
func (s *UserService) Create(ctx context.Context, user *model.User) error {
	// Проверяем, не существует ли пользователь с таким email
	var existingUser model.User
	result := s.db.WithContext(ctx).Where("email = ?", user.Email).First(&existingUser)
	if result.Error == nil {
		return fmt.Errorf("пользователь с email %s уже существует", user.Email)
	}

	// Хешируем пароль
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("ошибка хеширования пароля: %w", err)
	}
	user.Password = string(hashedPassword)

	// Создаём пользователя
	result = s.db.WithContext(ctx).Create(user)
	if result.Error != nil {
		return fmt.Errorf("ошибка создания: %w", result.Error)
	}

	log.Printf("✅ Создан пользователь: %s (id=%d, email=%s)", user.Name, user.ID, user.Email)
	return nil
}

// Update - обновляет данные пользователя
func (s *UserService) Update(ctx context.Context, id int, user *model.User) error {
	// Если передан новый пароль - хешируем его
	if user.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return fmt.Errorf("ошибка хеширования пароля: %w", err)
		}
		user.Password = string(hashedPassword)
	}

	result := s.db.WithContext(ctx).Model(&model.User{}).Where("id = ?", id).Updates(user)
	if result.Error != nil {
		return fmt.Errorf("ошибка обновления: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("пользователь с id %d не найден", id)
	}

	log.Printf("✅ Обновлён пользователь id=%d", id)
	return nil
}

// Delete - удаляет пользователя
func (s *UserService) Delete(ctx context.Context, id int) error {
	result := s.db.WithContext(ctx).Delete(&model.User{}, id)
	if result.Error != nil {
		return fmt.Errorf("ошибка удаления: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("пользователь с id %d не найден", id)
	}

	log.Printf("✅ Удалён пользователь id=%d", id)
	return nil
}

// UpdateRole - обновляет роль пользователя
func (s *UserService) UpdateRole(ctx context.Context, id int, role string) error {
	result := s.db.WithContext(ctx).Model(&model.User{}).Where("id = ?", id).Update("role", role)
	if result.Error != nil {
		return fmt.Errorf("ошибка обновления роли: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("пользователь с id %d не найден", id)
	}

	log.Printf("✅ Обновлена роль пользователя id=%d: %s", id, role)
	return nil
}
