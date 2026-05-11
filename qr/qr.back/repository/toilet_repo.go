package repository

import (
	"errors"
	core "qr-back/core"
	"qr-back/models"

	"gorm.io/gorm"
)

type ToiletRepository struct {
	db *gorm.DB
}

func NewToiletRepository() *ToiletRepository {
	return &ToiletRepository{db: core.DB}
}

// GetAll - все туалеты
func (r *ToiletRepository) GetAll() ([]models.Toilet, error) {
	var toilets []models.Toilet
	err := r.db.Order("id ASC").Find(&toilets).Error
	return toilets, err
}

// GetByID - получение туалета по ID
func (r *ToiletRepository) GetByID(id uint) (*models.Toilet, error) {
	var toilet models.Toilet
	err := r.db.First(&toilet, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("туалет не найден")
	}
	return &toilet, err
}

// GetRatingsByToiletID - получить все оценки туалета
func (r *ToiletRepository) GetRatingsByToiletID(toiletID uint) ([]models.ToiletRating, error) {
	var ratings []models.ToiletRating
	err := r.db.Where("toilet_id = ?", toiletID).Order("created_at DESC").Find(&ratings).Error
	return ratings, err
}

// AddRating - добавление оценки
func (r *ToiletRepository) AddRating(rating *models.ToiletRating) error {
	if err := rating.Validate(); err != nil {
		return err
	}

	// Проверяем существование туалета
	var toilet models.Toilet
	if err := r.db.First(&toilet, rating.ToiletID).Error; err != nil {
		return errors.New("туалет не найден")
	}

	// Создаём оценку
	if err := r.db.Create(rating).Error; err != nil {
		return err
	}

	// Обновляем средний рейтинг
	var avgRating float32
	r.db.Model(&models.ToiletRating{}).
		Where("toilet_id = ?", rating.ToiletID).
		Select("AVG(condition_room)").Scan(&avgRating)
	r.db.Model(&toilet).Update("rating", avgRating)

	return nil
}

// DeleteRating - удаление оценки
func (r *ToiletRepository) DeleteRating(ratingID uint) error {
	// Получаем оценку, чтобы узнать toiletID для обновления рейтинга
	var rating models.ToiletRating
	if err := r.db.First(&rating, ratingID).Error; err != nil {
		return errors.New("оценка не найдена")
	}

	toiletID := rating.ToiletID

	// Удаляем оценку
	result := r.db.Delete(&models.ToiletRating{}, ratingID)
	if result.RowsAffected == 0 {
		return errors.New("оценка не найдена")
	}

	// Обновляем средний рейтинг туалета
	var avgRating float32
	r.db.Model(&models.ToiletRating{}).
		Where("toilet_id = ?", toiletID).
		Select("AVG(condition_room)").Scan(&avgRating)

	var toilet models.Toilet
	r.db.First(&toilet, toiletID)
	r.db.Model(&toilet).Update("rating", avgRating)

	return nil
}

// package repository

// import (
// 	"errors"
// 	core "qr-back/core"
// 	"qr-back/models"

// 	"gorm.io/gorm"
// )

// type ToiletRepository struct {
// 	db *gorm.DB
// }

// func NewToiletRepository() *ToiletRepository {
// 	return &ToiletRepository{db: core.DB}
// }

// // Create - создание туалета
// func (r *ToiletRepository) Create(toilet *models.Toilet) error {
// 	if err := toilet.Validate(); err != nil {
// 		return err
// 	}
// 	return r.db.Create(toilet).Error
// }

// // GetByID - получение по ID
// func (r *ToiletRepository) GetByID(id uint) (*models.Toilet, error) {
// 	var toilet models.Toilet
// 	err := r.db.Preload("ToiletRatings").First(&toilet, id).Error
// 	if errors.Is(err, gorm.ErrRecordNotFound) {
// 		return nil, errors.New("туалет не найден")
// 	}
// 	return &toilet, err
// }

// // GetAll - все туалеты
// func (r *ToiletRepository) GetAll() ([]models.Toilet, error) {
// 	var toilets []models.Toilet
// 	err := r.db.Order("rating DESC").Find(&toilets).Error
// 	return toilets, err
// }

// // Update - обновление
// func (r *ToiletRepository) Update(id uint, updates map[string]interface{}) (*models.Toilet, error) {
// 	var toilet models.Toilet
// 	if err := r.db.First(&toilet, id).Error; err != nil {
// 		return nil, errors.New("туалет не найден")
// 	}
// 	if err := r.db.Model(&toilet).Updates(updates).Error; err != nil {
// 		return nil, err
// 	}
// 	r.db.First(&toilet, id)
// 	return &toilet, nil
// }

// // Delete - удаление
// func (r *ToiletRepository) Delete(id uint) error {
// 	result := r.db.Delete(&models.Toilet{}, id)
// 	if result.RowsAffected == 0 {
// 		return errors.New("туалет не найден")
// 	}
// 	return result.Error
// }

// // AddRating - добавление оценки
// func (r *ToiletRepository) AddRating(rating *models.ToiletRating) error {
// 	if err := rating.Validate(); err != nil {
// 		return err
// 	}

// 	// Проверяем существование туалета
// 	var toilet models.Toilet
// 	if err := r.db.First(&toilet, rating.ToiletID).Error; err != nil {
// 		return errors.New("туалет не найден")
// 	}

// 	// Создаём оценку
// 	if err := r.db.Create(rating).Error; err != nil {
// 		return err
// 	}

// 	// Обновляем средний рейтинг
// 	var avgRating float32
// 	r.db.Model(&models.ToiletRating{}).
// 		Where("toilet_id = ?", rating.ToiletID).
// 		Select("AVG(condition_room)").Scan(&avgRating)
// 	r.db.Model(&toilet).Update("rating", avgRating)

// 	return nil
// }
