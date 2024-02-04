import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { CategoryGetListDTO, CategoryStoreDTO, CategoryUpdateDTO } from './dto/category.dto';
import { CategoryRepository } from './category.repository';
import { CategoryDeleteRO, CategoryGetDetailRO, CategoryGetListRO, CategoryStoreRO, CategoryUpdateRO } from './ro/category.ro';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryService extends BaseService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly categoryRepository: CategoryRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: CategoryStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    let response: CategoryStoreRO;

    try {
      const categoryData = new CategoryEntity({
        name: dto.name,
        description: dto.description,
        createdBy: actorId,
      });

      const category = await this.categoryRepository.insert(categoryData);

      response = new CategoryStoreRO({
        id: category.id,
        name: category.name,
        description: category.description,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.CATEGORY.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: CategoryStoreRO,
      response,
      message: 'Store category successfully',
      actorId,
    });
  }

  async getList(dto: CategoryGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.categoryRepository.find(dto);
      return this.success({
        classRO: CategoryGetListRO,
        response,
        message: 'Get list category successfully',
        actorId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.CATEGORY.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    let category: CategoryEntity;
    try {
      category = await this.categoryRepository.findOneById(id);
    } catch (error) {
      const { code, status, message } = EXCEPTION.CATEGORY.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    if (!category) {
      const { code, status, message } = EXCEPTION.CATEGORY.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    const response = new CategoryGetDetailRO({
      id: category.id,
      name: category.name,
      description: category.description,
    });

    return this.success({
      classRO: CategoryGetDetailRO,
      response,
    });
  }

  async update(id: number, dto: CategoryUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    let response: CategoryUpdateRO;

    try {
      const categoryData = new CategoryEntity();
      categoryData.name = dto.name;
      categoryData.description = dto.description;
      categoryData.updatedAt = new Date();
      categoryData.updatedBy = actorId;

      const category = await this.categoryRepository.update(id, categoryData);

      response = new CategoryUpdateRO({
        id: category.id,
        name: category.name,
        description: category.description,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.CATEGORY.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: CategoryUpdateRO,
      response,
      message: 'Update category successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelele(id, actorId);

    let response: CategoryDeleteRO;

    try {
      const category = await this.categoryRepository.delete(id, actorId);

      response = new CategoryDeleteRO({
        id: category.id,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.CATEGORY.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: CategoryDeleteRO,
      response,
      message: 'Delete category successfully',
      actorId,
    });
  }

  private async validateStore(dto: CategoryStoreDTO, actorId: number) {
    // Check name unique
    const categoryCount = await this.categoryRepository.countByName(dto.name);
    if (categoryCount) {
      const { code, status, message } = EXCEPTION.CATEGORY.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(id: number, dto: CategoryUpdateDTO, actorId: number) {
    // Check exist
    const categoryCountById = await this.categoryRepository.countById(id);
    if (!categoryCountById) {
      const { code, status, message } = EXCEPTION.CATEGORY.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check name unique except id
    const categoryCountByName = await this.categoryRepository.countByNameExceptId(dto.name, id);
    if (categoryCountByName) {
      const { code, status, message } = EXCEPTION.CATEGORY.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateDelele(id: number, actorId: number) {
    // Check exist
    const categoryCount = await this.categoryRepository.countById(id);
    if (!categoryCount) {
      const { code, status, message } = EXCEPTION.CATEGORY.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
