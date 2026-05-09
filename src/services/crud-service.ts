import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
export class CrudService<
  Model extends {
    findMany: Function;
    create: Function;
    update: Function;
    delete: Function;
    findUnique: Function;
  },
  Create,
  Update,
  Unique,
> {
  constructor(
    private model: Model,
    private include?: any,
    private orderBy?: any,
  ) {}

  async findAll() {
    try {
      const data = await this.model.findMany({
        include: this.include,
        orderBy: this.orderBy,
      });

      return {
        statusCode: 200,
        message: "All data",
        data,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: Create) {
    try {
      const newData = await this.model.create({
        data,
        include: this.include,
      });

      return {
        statusCode: 201,
        message: "create success",
        data: newData,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(where: Unique, data: Update) {
    try {
      const record = await this.model.findUnique({
        where,
      });

      if (!record) throw new NotFoundException("data not found");

      const updatedData = await this.model.update({
        where,
        data,
        include: this.include,
      });

      return {
        statusCode: 200,
        message: "update succesfully",
        data: updatedData,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(where: Unique) {
    try {
      const record = await this.model.findUnique({
        where,
      });

      if (!record) {
        throw new NotFoundException("data not found");
      }

      await this.model.delete({ where });

      return {
        statusCode: 200,
        message: "delete successfuly",
        data: true,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findBySpecificColumn(where: Unique, select?: any) {
    try {
      const record = await this.model.findUnique({
        where,
        include: select ? undefined : this.include,
        select,
      });

      if (!record) throw new NotFoundException("data not found");

      return {
        statusCode: 200,
        message: "the data",
        data: record,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findManyByColumn(where: any) {
    try {
      const records = await this.model.findMany({
        where,
        include: this.include,
      });

      if (!records || records.length === 0) {
        throw new NotFoundException("No records found");
      }

      return {
        statusCode: 200,
        message: "Data retrieved successfully",
        data: records,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  protected handleError(error: unknown) {
    if (error instanceof HttpException) throw error;
    else if (
      error instanceof Error &&
      error.name === "PrismaClientValidationError"
    )
      throw new BadRequestException(error.message);
    throw new InternalServerErrorException(error);
  }
}
