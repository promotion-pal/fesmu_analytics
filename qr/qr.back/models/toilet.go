package models

import (
	"errors"
	"time"
)

type Toilet struct {
	ID        uint      `gorm:"primaryKey" json:"id" example:"1"`
	Name      string    `gorm:"size:100;not null" json:"name" example:"Центральный туалет"`
	CreatedAt time.Time `json:"created_at" example:"2026-05-11T10:00:00Z"`
	UpdatedAt time.Time `json:"updated_at" example:"2026-05-11T10:00:00Z"`

	Ratings []ToiletRating `gorm:"foreignKey:ToiletID" json:"ratings,omitempty"`
}

type ToiletRating struct {
	ID             uint      `gorm:"primaryKey" json:"id" example:"1"`
	ToiletID       uint      `gorm:"not null;index" json:"toilet_id" example:"1"`
	ConditionRoom  int       `gorm:"not null" json:"condition_room" example:"8" minimum:"0" maximum:"5"`
	SoapAvailable  bool      `json:"soap_available" example:"true"`
	PaperAvailable bool      `json:"paper_available" example:"true"`
	Comment        string    `gorm:"size:500" json:"comment" example:"Чисто, есть мыло"`
	CreatedAt      time.Time `json:"created_at" example:"2026-05-11T10:00:00Z"`

	Toilet Toilet `gorm:"foreignKey:ToiletID;references:ID" json:"toilet,omitempty"`
}

func (t *Toilet) Validate() error {
	if t.Name == "" {
		return errors.New("название туалета обязательно")
	}
	if len(t.Name) < 3 {
		return errors.New("название должно быть минимум 3 символа")
	}
	return nil
}

func (tr *ToiletRating) Validate() error {
	if tr.ToiletID == 0 {
		return errors.New("ID туалета обязателен")
	}
	if tr.ConditionRoom < 0 || tr.ConditionRoom > 5 {
		return errors.New("оценка должна быть от 0 до 5")
	}
	return nil
}
