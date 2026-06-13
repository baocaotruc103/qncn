import json
from pathlib import Path

data = {
  "metadata": {
    "name": "Quy tắc nhập và tự động điền quá trình lương QNCN, VCQP, CNQP",
    "version": "1.0.0",
    "language": "vi",
    "date_format": "MM/YYYY",
    "notes": [
      "Mỗi thay đổi về diện đối tượng, loại/ngạch, nhóm, bậc, hệ số hoặc phụ cấp phải tạo một bản ghi quá trình mới.",
      "Không sửa đè bản ghi cũ, trừ trường hợp sửa sai dữ liệu.",
      "QNCN cao cấp nhóm 1 và nhóm 2 có 12 bậc; QNCN trung cấp và sơ cấp có 10 bậc."
    ]
  },
  "defaults": {
    "management_area": "Quân lực quản lý",
    "social_insurance": True,
    "allowance_entitlement": False,
    "position_allowance": 0,
    "conversion_coefficient": None,
    "preservation_coefficient": 0
  },
  "fields": {
    "military_start_month": {
      "label": "Tháng năm bắt đầu vào Quân đội",
      "type": "month",
      "required": True,
      "format": "MM/YYYY",
      "accepted_entry_types": [
        "TUYEN_DUNG_QNCN",
        "TUYEN_DUNG_VCQP",
        "TUYEN_DUNG_CNQP",
        "TUYEN_CHON_QNCN",
        "NHAP_NGU"
      ],
      "excluded_entry_types": [
        "LDHD"
      ],
      "rules": [
        {
          "when": {
            "entry_type": "LDHD"
          },
          "action": "DO_NOT_COUNT_AS_MILITARY_START"
        },
        {
          "when": {
            "transition_from": "LDHD",
            "transition_to_in": ["QNCN", "VCQP", "CNQP"]
          },
          "action": "USE_TRANSITION_EFFECTIVE_MONTH"
        },
        {
          "when": {
            "transition_from": "HSQBS",
            "transition_to": "QNCN"
          },
          "action": "USE_ENLISTMENT_MONTH"
        }
      ]
    },
    "work_unit": {
      "label": "Đơn vị công tác",
      "type": "select",
      "required": True,
      "selection_level": "Đơn vị cấp trực thuộc Bộ Quốc phòng",
      "examples": [
        "Quân khu 1",
        "Quân khu 2",
        "Bộ Tư lệnh Thủ đô Hà Nội",
        "Học viện Quân y"
      ],
      "special_rules": [
        {
          "when": {
            "value": "Học viện Quân y"
          },
          "enable_subunit_selection": True,
          "subunit_examples": [
            "Bệnh viện Quân y 103",
            "Khoa Lao",
            "BM-TT Nội hô hấp"
          ]
        }
      ]
    },
    "work_unit_detail": {
      "label": "Đơn vị công tác chi tiết",
      "type": "text",
      "required": False,
      "separator": ", ",
      "abbreviations": {
        "Tiểu đội": "a",
        "Trung đội": "b",
        "Đại đội": "c",
        "Tiểu đoàn": "d",
        "Trung đoàn": "e",
        "Sư đoàn": "f",
        "Lữ đoàn": "LĐ",
        "Quân khu": "QK",
        "Quân đoàn": "QĐ",
        "Binh chủng": "BC",
        "Quân chủng": "QC"
      },
      "normalization_examples": {
        "Đại đội 2": "c2",
        "Tiểu đoàn 2": "d2",
        "Lữ đoàn 543": "LĐ543",
        "Quân khu 2": "QK2"
      },
      "example_output": "c2, d2, LĐ543, QK2"
    },
    "change_type": {
      "label": "Loại thay đổi",
      "type": "select",
      "required": True,
      "options": [
        {
          "code": "CHANGE_SUBJECT_TYPE",
          "label": "Chuyển diện đối tượng",
          "examples": [
            "HSQBS sang QNCN",
            "LĐHĐ sang QNCN",
            "LĐHĐ sang VCQP",
            "LĐHĐ sang CNQP",
            "VCQP sang QNCN"
          ],
          "required_fields": [
            "old_subject_type",
            "new_subject_type",
            "effective_month"
          ]
        },
        {
          "code": "CHANGE_SALARY_GROUP",
          "label": "Chuyển nhóm lương",
          "examples": [
            "Sơ cấp lên Trung cấp",
            "Sơ cấp lên Cao cấp",
            "Trung cấp lên Cao cấp",
            "Cao cấp nhóm 2 lên Cao cấp nhóm 1"
          ],
          "required_fields": [
            "old_salary_group",
            "new_salary_group",
            "new_salary_grade",
            "salary_start_month"
          ]
        },
        {
          "code": "ON_TIME_SALARY_INCREASE",
          "label": "Nâng bậc lương đúng hạn"
        },
        {
          "code": "DELAYED_SALARY_INCREASE",
          "label": "Nâng bậc lương kéo dài",
          "warning_threshold_months": 6,
          "required_fields": [
            "delay_months",
            "delay_reason",
            "salary_start_month"
          ]
        },
        {
          "code": "EARLY_SALARY_INCREASE",
          "label": "Nâng bậc lương trước niên hạn",
          "max_early_months": 12
        },
        {
          "code": "CHANGE_SALARY_CLASS",
          "label": "Nâng loại/ngạch lương",
          "examples": [
            "CC2 lên CC1"
          ]
        }
      ]
    },
    "management_area": {
      "label": "Diện quản lý",
      "type": "text",
      "default": "Quân lực quản lý",
      "readonly": True,
      "admin_editable": True
    },
    "placement_area": {
      "label": "Diện bố trí",
      "type": "select",
      "required": True,
      "options": [
        "Binh sĩ",
        "Hạ sĩ quan",
        "Quân nhân chuyên nghiệp",
        "Công nhân quốc phòng",
        "Viên chức quốc phòng",
        "Lao động hợp đồng",
        "Khác"
      ],
      "auto_suggestions": {
        "HSQBS": "Hạ sĩ quan/Binh sĩ",
        "QNCN": "Quân nhân chuyên nghiệp",
        "CNQP": "Công nhân quốc phòng",
        "VCQP": "Viên chức quốc phòng",
        "LDHD": "Lao động hợp đồng"
      }
    },
    "rank": {
      "label": "Cấp bậc",
      "type": "dependent_select",
      "required": True,
      "depends_on": "subject_type",
      "options_by_subject_type": {
        "HSQBS": [
          "Binh nhì",
          "Binh nhất",
          "Hạ sĩ",
          "Trung sĩ",
          "Thượng sĩ"
        ],
        "QNCN": [
          "Thiếu úy QNCN",
          "Trung úy QNCN",
          "Thượng úy QNCN",
          "Đại úy QNCN",
          "Thiếu tá QNCN",
          "Trung tá QNCN",
          "Thượng tá QNCN"
        ]
      }
    },
    "military_specialty": {
      "label": "Chức vụ, chuyên môn quân sự đang làm",
      "type": "searchable_select_or_text",
      "required": True,
      "examples": [
        "Kỹ thuật viên",
        "Điều dưỡng",
        "Điều dưỡng viên",
        "Điều dưỡng trưởng",
        "Lái xe",
        "Nhân viên quân y"
      ]
    },
    "specialty_start_month": {
      "label": "Tháng năm đảm nhận chuyên môn quân sự",
      "type": "month",
      "format": "MM/YYYY",
      "required": True,
      "meaning": "Thời điểm có hiệu lực của chuyển diện, nâng lương, nâng loại/ngạch hoặc thay đổi chuyên môn"
    },
    "count_seniority": {
      "label": "Có tính thâm niên",
      "type": "boolean",
      "default": False,
      "auto_rules": [
        {
          "subject_type_in": ["HSQBS", "QNCN"],
          "value": True
        },
        {
          "subject_type": "VCQP",
          "from_month": "07/2016",
          "value": True
        }
      ]
    },
    "allowance_entitlement": {
      "label": "Có tính hưởng trợ cấp",
      "type": "boolean",
      "default": False,
      "when_true_require": [
        "allowance_type",
        "allowance_amount",
        "allowance_start_month"
      ]
    },
    "social_insurance": {
      "label": "Có tính đóng BHXH",
      "type": "boolean",
      "default": True,
      "readonly": True,
      "admin_editable": True
    },
    "salary_class": {
      "label": "Loại/ngạch",
      "type": "select",
      "required": True,
      "options": [
        {
          "code": "QNCN_SC",
          "label": "Sơ cấp"
        },
        {
          "code": "QNCN_TC",
          "label": "Trung cấp"
        },
        {
          "code": "QNCN_CC",
          "label": "Cao cấp"
        }
      ]
    },
    "salary_group": {
      "label": "Nhóm",
      "type": "dependent_select",
      "required": True,
      "depends_on": "salary_class",
      "options_by_class": {
        "QNCN_SC": [
          {
            "code": "QNCN_SC",
            "label": "Sơ cấp"
          }
        ],
        "QNCN_TC": [
          {
            "code": "QNCN_TC",
            "label": "Trung cấp"
          }
        ],
        "QNCN_CC": [
          {
            "code": "QNCN_CC_N2",
            "label": "Cao cấp nhóm 2"
          },
          {
            "code": "QNCN_CC_N1",
            "label": "Cao cấp nhóm 1"
          }
        ]
      }
    },
    "salary_grade": {
      "label": "Bậc",
      "type": "dependent_select",
      "required": True,
      "depends_on": "salary_group",
      "allowed_ranges": {
        "QNCN_SC": [1, 10],
        "QNCN_TC": [1, 10],
        "QNCN_CC_N2": [1, 12],
        "QNCN_CC_N1": [1, 12]
      }
    },
    "salary_coefficient": {
      "label": "Hệ số lương",
      "type": "number",
      "readonly": True,
      "auto_fill_from": [
        "salary_group",
        "salary_grade"
      ]
    },
    "beyond_frame_seniority_percent": {
      "label": "PC thâm niên vượt khung (%)",
      "type": "number",
      "readonly": True,
      "default": 0
    },
    "preservation_coefficient": {
      "label": "Hệ số bảo lưu",
      "type": "number",
      "default": 0,
      "examples": [0.18, 0.25],
      "when_greater_than_zero_require": [
        "preservation_reason",
        "decision_number",
        "preservation_start_month"
      ]
    },
    "position_allowance": {
      "label": "Phụ cấp chức vụ",
      "type": "number",
      "default": 0,
      "readonly_when_subject_type_in": ["QNCN", "VCQP"]
    },
    "professional_seniority_allowance": {
      "label": "Phụ cấp thâm niên nghề",
      "type": "calculated",
      "eligible_periods": [
        {
          "before": "07/2016",
          "subject_types": ["HSQBS", "QNCN"]
        },
        {
          "from": "07/2016",
          "subject_types": ["HSQBS", "QNCN", "VCQP"]
        }
      ]
    },
    "salary_start_month": {
      "label": "Tháng năm bắt đầu nhận lương",
      "type": "month",
      "format": "MM/YYYY",
      "required": True,
      "auto_fill": "effective_month"
    },
    "conversion_coefficient": {
      "label": "Hệ số quy đổi",
      "type": "number",
      "default": None,
      "readonly_when_subject_type_in": ["QNCN", "VCQP"]
    }
  },
  "salary_tables": {
    "QNCN_CC_N1": {
      "label": "QNCN cao cấp nhóm 1",
      "max_grade": 12,
      "coefficients": {
        "1": 3.85,
        "2": 4.20,
        "3": 4.55,
        "4": 4.90,
        "5": 5.25,
        "6": 5.60,
        "7": 5.95,
        "8": 6.30,
        "9": 6.65,
        "10": 7.00,
        "11": 7.35,
        "12": 7.70
      }
    },
    "QNCN_CC_N2": {
      "label": "QNCN cao cấp nhóm 2",
      "max_grade": 12,
      "coefficients": {
        "1": 3.65,
        "2": 4.00,
        "3": 4.35,
        "4": 4.70,
        "5": 5.05,
        "6": 5.40,
        "7": 5.75,
        "8": 6.10,
        "9": 6.45,
        "10": 6.80,
        "11": 7.15,
        "12": 7.50
      }
    },
    "QNCN_TC": {
      "label": "QNCN trung cấp",
      "max_grade": 10,
      "coefficients": {
        "1": 3.50,
        "2": 3.80,
        "3": 4.10,
        "4": 4.40,
        "5": 4.70,
        "6": 5.00,
        "7": 5.30,
        "8": 5.60,
        "9": 5.90,
        "10": 6.20
      }
    },
    "QNCN_SC": {
      "label": "QNCN sơ cấp",
      "max_grade": 10,
      "coefficients": {
        "1": 3.20,
        "2": 3.45,
        "3": 3.70,
        "4": 3.95,
        "5": 4.20,
        "6": 4.45,
        "7": 4.70,
        "8": 4.95,
        "9": 5.20,
        "10": 5.45
      }
    }
  },
  "salary_increase_policy": [
    {
      "period": {
        "before": "07/2014"
      },
      "rules": [
        {
          "subject_type": "QNCN",
          "months": 36
        },
        {
          "subject_type_in": ["VCQP", "CNQP"],
          "months": 24
        }
      ]
    },
    {
      "period": {
        "from": "07/2014",
        "to": "11/2022"
      },
      "rules": [
        {
          "subject_type": "QNCN",
          "condition": "salary_coefficient < 4.70",
          "months": 24
        },
        {
          "subject_type": "QNCN",
          "condition": "salary_coefficient >= 4.70",
          "months": 36
        }
      ]
    },
    {
      "period": {
        "from": "12/2022"
      },
      "rules": [
        {
          "subject_type": "QNCN",
          "condition": "salary_coefficient < 5.40",
          "months": 24
        },
        {
          "subject_type": "QNCN",
          "condition": "salary_coefficient >= 5.40",
          "months": 36
        }
      ]
    }
  ],
  "beyond_frame_policy": {
    "eligible_only_at_max_grade": True,
    "first_entitlement_after_months": 36,
    "first_percent": 5,
    "additional_month_interval": 12,
    "additional_percent_per_interval": 1,
    "formula": "months_at_max_grade < 36 ? 0 : 5 + floor((months_at_max_grade - 36) / 12)"
  },
  "professional_seniority_policy": {
    "periods": [
      {
        "before": "07/2016",
        "eligible_subject_types": ["HSQBS", "QNCN"]
      },
      {
        "from": "07/2016",
        "eligible_subject_types": ["HSQBS", "QNCN", "VCQP"]
      }
    ],
    "exclude": [
      "LDHD",
      "Thời gian gián đoạn không được tính",
      "Thời gian bị loại trừ theo quyết định"
    ]
  },
  "auto_fill_sequence": [
    "Load personal information and military_start_month",
    "Copy latest work_unit",
    "Copy latest work_unit_detail",
    "Set management_area = Quân lực quản lý",
    "Copy latest placement_area",
    "Select change_type",
    "Determine new subject_type",
    "Load rank options",
    "Select salary_class",
    "Load salary_group options",
    "Select salary_group",
    "Load valid salary_grade options",
    "Select salary_grade",
    "Auto-fill salary_coefficient",
    "Determine salary increase cycle",
    "Calculate next salary increase month",
    "Check beyond-frame seniority",
    "Calculate professional seniority",
    "Check social insurance, allowances and preservation coefficient",
    "Show preview before save"
  ],
  "validation_rules": [
    {
      "code": "REQUIRED_EFFECTIVE_MONTH",
      "message": "Thiếu tháng năm bắt đầu hiệu lực."
    },
    {
      "code": "REQUIRED_WORK_UNIT",
      "message": "Thiếu đơn vị công tác."
    },
    {
      "code": "REQUIRED_SUBJECT_TYPE",
      "message": "Thiếu diện đối tượng."
    },
    {
      "code": "REQUIRED_CHANGE_TYPE",
      "message": "Thiếu loại thay đổi."
    },
    {
      "code": "REQUIRED_SALARY_GROUP",
      "message": "Đã chọn loại/ngạch nhưng chưa chọn nhóm."
    },
    {
      "code": "REQUIRED_SALARY_GRADE",
      "message": "Đã chọn nhóm nhưng chưa chọn bậc."
    },
    {
      "code": "INVALID_SALARY_GRADE",
      "message": "Bậc lương vượt quá bậc tối đa của nhóm."
    },
    {
      "code": "SALARY_COEFFICIENT_NOT_FOUND",
      "message": "Không xác định được hệ số lương theo nhóm và bậc đã chọn."
    },
    {
      "code": "SALARY_START_BEFORE_MILITARY_START",
      "message": "Ngày bắt đầu hưởng lương không được trước ngày bắt đầu vào Quân đội."
    },
    {
      "code": "INVALID_GRADE_INCREASE",
      "message": "Nâng bậc nhưng bậc mới không lớn hơn bậc cũ."
    },
    {
      "code": "EARLY_INCREASE_OVER_12_MONTHS",
      "message": "Nâng trước niên hạn quá 12 tháng, cần xác nhận hoặc căn cứ bổ sung."
    },
    {
      "code": "ALLOWANCE_DETAIL_REQUIRED",
      "message": "Đã chọn hưởng trợ cấp nhưng chưa nhập loại trợ cấp."
    },
    {
      "code": "PRESERVATION_REASON_REQUIRED",
      "message": "Đã nhập hệ số bảo lưu nhưng chưa nhập căn cứ."
    },
    {
      "code": "INVALID_BEYOND_FRAME_ALLOWANCE",
      "message": "Chỉ được tính phụ cấp vượt khung khi đang ở bậc cuối."
    }
  ],
  "warning_rules": [
    {
      "code": "LOWER_COEFFICIENT_AFTER_GROUP_CHANGE",
      "message": "Hệ số mới thấp hơn hệ số cũ sau khi chuyển nhóm."
    },
    {
      "code": "DELAY_UNDER_6_MONTHS",
      "message": "Ngày nâng lương thực tế muộn hơn dự kiến nhưng dưới 6 tháng."
    },
    {
      "code": "MULTIPLE_RECORDS_SAME_MONTH",
      "message": "Có nhiều bản ghi trong cùng một tháng."
    },
    {
      "code": "MISSING_DECISION_NUMBER",
      "message": "Chuyển diện nhưng chưa nhập số quyết định."
    },
    {
      "code": "PROCESS_GAP",
      "message": "Có khoảng trống giữa hai quá trình công tác."
    },
    {
      "code": "PROCESS_OVERLAP",
      "message": "Có hai bản ghi bị chồng lấn thời gian."
    },
    {
      "code": "UNCOMMON_PRESERVATION_COEFFICIENT",
      "message": "Hệ số bảo lưu không thuộc danh mục thường dùng."
    }
  ],
  "audit": {
    "required_fields": [
      "created_by",
      "created_at",
      "updated_by",
      "updated_at",
      "before_data",
      "after_data",
      "change_reason",
      "status"
    ],
    "statuses": [
      "DRAFT",
      "PENDING_APPROVAL",
      "APPROVED",
      "CANCELLED"
    ],
    "approved_record_direct_edit": False
  },
  "implementation_notes": [
    "Quy tắc nâng lương của VCQP và CNQP từ 07/2014 trở đi chưa được cung cấp đầy đủ; hệ thống nên trả về null hoặc yêu cầu nhập thủ công.",
    "Nên lưu hệ số lương dạng số thập phân dùng dấu chấm trong JSON và chỉ định dạng dấu phẩy khi hiển thị trên giao diện.",
    "Nên tính thời gian theo tháng để tránh sai lệch do số ngày trong tháng."
  ]
}

output_path = Path("/mnt/data/quy_tac_luong_qncn_vcqp_cnqp.json")
with output_path.open("w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(output_path)
