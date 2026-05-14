package com.craftcorner.common.service;

import com.craftcorner.common.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface CrudService<ResponseDto, CreateRequest, UpdateRequest, ID> {

    ResponseDto create(CreateRequest request);

    ResponseDto getById(ID id);

    ResponseDto update(ID id, UpdateRequest request);

    void delete(ID id);

    PageResponse<ResponseDto> getAll(Pageable pageable);
}
