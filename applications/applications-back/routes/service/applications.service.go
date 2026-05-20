package service

import (
	"context"
	"fmt"
	"log"

	"gorm.io/gorm"

	model "applications-back/models"
)

type ApplicationService struct {
	db *gorm.DB
}

func NewApplicationService(db *gorm.DB) *ApplicationService {
	if db == nil {
		log.Println("⚠️ ВНИМАНИЕ: db равен nil")
	}
	return &ApplicationService{db: db}
}

func (s *ApplicationService) GetAll(ctx context.Context) ([]model.Application, error) {
	var applications []model.Application
	result := s.db.WithContext(ctx).Find(&applications)
	if result.Error != nil {
		return nil, fmt.Errorf("ошибка запроса: %w", result.Error)
	}

	log.Printf("📦 Найдено %d приложений", len(applications))
	return applications, nil
}

func (s *ApplicationService) GetByID(ctx context.Context, id int) (*model.Application, error) {
	var app model.Application
	result := s.db.WithContext(ctx).First(&app, id)
	if result.Error != nil {
		return nil, fmt.Errorf("приложение с id %d не найдено: %w", id, result.Error)
	}

	return &app, nil
}

func (s *ApplicationService) Create(ctx context.Context, app *model.Application) error {
	result := s.db.WithContext(ctx).Create(app)
	if result.Error != nil {
		return fmt.Errorf("ошибка создания: %w", result.Error)
	}

	log.Printf("✅ Создано приложение: %s (id=%d)", app.Name, app.ID)
	return nil
}

func (s *ApplicationService) Update(ctx context.Context, id int, app *model.Application) error {
	result := s.db.WithContext(ctx).Model(&model.Application{}).Where("id = ?", id).Updates(app)
	if result.Error != nil {
		return fmt.Errorf("ошибка обновления: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("приложение с id %d не найдено", id)
	}

	log.Printf("✅ Обновлено приложение id=%d", id)
	return nil
}

func (s *ApplicationService) Delete(ctx context.Context, id int) error {
	result := s.db.WithContext(ctx).Delete(&model.Application{}, id)
	if result.Error != nil {
		return fmt.Errorf("ошибка удаления: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("приложение с id %d не найдено", id)
	}

	log.Printf("✅ Удалено приложение id=%d", id)
	return nil
}
