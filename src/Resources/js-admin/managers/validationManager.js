
    c.validationManager =
    {
        getDefaultRuleAppError: function (error)
        {
            switch (error) {
                case "REQUIRED":    return "E_REQUIRED";
                case "MIN":         return "E_MIN";
                case "MAX":         return "E_MAX";
                case "MIN_VALUE":   return "E_MIN_VALUE";
                case "MAX_VALUE":   return "E_MAX_VALUE";
                case "MIN_LENGTH":  return "E_MIN_LENGTH";
                case "MAX_LENGTH":  return "E_MAX_LENGTH";
                case "REGEX":       return "E_REGEX";
                default:            return "E_DEFAULT";
            }
        },

        getDefaultRuleAdminError: function (error)
        {
            switch (error) {
                case "REQUIRED":    return "form_error_required";
                case "INVALID":     return "form_error_invalid";
                case "MULTIPLE":    return "form_error_multiple";
                case "MIN":         return "form_error_min";
                case "MAX":         return "form_error_max";
                case "MIN_VALUE":   return "form_error_min_value";
                case "MAX_VALUE":   return "form_error_max_value";
                case "MIN_LENGTH":  return "form_error_min_length";
                case "MAX_LENGTH":  return "form_error_max_length";
                case "REGEX":       return "form_error_regex";
                case "BOOLEAN":     return "form_error_boolean";
                case "BINARY":      return "form_error_binary";
                case "UPLOAD":      return "form_error_upload";
                default:            return "form_error_unknown";
            }
        }
    };