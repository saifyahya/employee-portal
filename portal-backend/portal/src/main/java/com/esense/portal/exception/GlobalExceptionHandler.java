package com.esense.portal.exception;

import com.esense.portal.dto.ErrorResponseDto;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, String> validationErrors = new HashMap<>();
        List<ObjectError> validationErrorList = ex.getBindingResult().getAllErrors();
        validationErrorList.forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String validationMsg = error.getDefaultMessage();
            validationErrors.put(fieldName, validationMsg);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(validationErrors);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleResourceNotFoundException(ResourceNotFoundException exc, WebRequest request) {
        ErrorResponseDto errorResponseDto = new ErrorResponseDto();
        errorResponseDto.setStatus(HttpStatus.NOT_FOUND);
        errorResponseDto.setMessage(exc.getMessage());
        errorResponseDto.setApiPath(request.getDescription(false));
        errorResponseDto.setDateTime(LocalDateTime.now());
        return new ResponseEntity<>(errorResponseDto, HttpStatus.NOT_FOUND);
    }

//    @ExceptionHandler(UnAuthorizedException.class)
//    public ResponseEntity<ErrorResponseDto> handleUnAuthorizedException(UnAuthorizedException exc, WebRequest request) {
//        ErrorResponseDto errorResponseDto = new ErrorResponseDto();
//        errorResponseDto.setStatus(HttpStatus.FORBIDDEN);
//        errorResponseDto.setMessage(exc.getMessage());
//        errorResponseDto.setApiPath(request.getDescription(false));
//        errorResponseDto.setDateTime(LocalDateTime.now());
//        return new ResponseEntity<>(errorResponseDto, HttpStatus.FORBIDDEN);
//    }


    @ExceptionHandler(Exception.class)  //general run-time exception
    public ResponseEntity<ErrorResponseDto> generalRunTimeException(Exception exception, WebRequest webRequest) {
        ErrorResponseDto errorResponseDto = new ErrorResponseDto(HttpStatus.INTERNAL_SERVER_ERROR,
                webRequest.getDescription(false),
                exception.getMessage(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponseDto, errorResponseDto.getStatus());
    }

}
