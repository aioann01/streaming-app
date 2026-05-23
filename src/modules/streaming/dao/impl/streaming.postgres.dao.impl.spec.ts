import { Test, TestingModule } from "@nestjs/testing";
import { Logger, NotFoundException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StreamingPostgresDaoImpl } from "./streaming.postgres.dao.impl";
import { Streaming } from "../../entity/Streaming.entity";
import { CreateStreamingDto } from "../../dto/CreateStreaming.dto";
import { GetStreamingDetailsDto } from "../../dto/GetStreamingDetails.dto";
import {createStreamingValidRequest} from "../../../../../test/mock/api/requests";

describe("StreamingPostgresDaoImpl", () => {
    let dao: StreamingPostgresDaoImpl;
    let repository: Repository<Streaming>;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                StreamingPostgresDaoImpl,
                Logger,
                {
                    provide: getRepositoryToken(Streaming),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findAndCount: jest.fn(),
                        findOneBy: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        dao = module.get<StreamingPostgresDaoImpl>(StreamingPostgresDaoImpl);
        repository = module.get<Repository<Streaming>>(getRepositoryToken(Streaming));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create()", () => {
        it("should successfully create a streaming entity", async () => {
            const entity = { id: 1, ...createStreamingValidRequest };

            (repository.create as jest.Mock).mockReturnValue(entity);
            (repository.save as jest.Mock).mockResolvedValue(entity);

            const payload: CreateStreamingDto = JSON.parse(
                JSON.stringify(createStreamingValidRequest),
            );

            const result: GetStreamingDetailsDto = await dao.create(payload);

            expect(repository.create).toBeCalledWith(payload);
            expect(repository.save).toBeCalledWith(entity);
            expect(result).toEqual(entity);
        });
    });

    describe("findOne()", () => {
        it("should return streaming item when found", async () => {
            const entity = { id: 1, title: "test" };

            (repository.findOneBy as jest.Mock).mockResolvedValue(entity);

            const result = await dao.findOne(1);

            expect(repository.findOneBy).toBeCalledWith({ id: 1 });
            expect(result).toEqual(entity);
        });

        it("should throw NotFoundException when not found", async () => {
            (repository.findOneBy as jest.Mock).mockResolvedValue(null);

            try {
                await dao.findOne(1);
                expect(true).toBeFalsy();
            }catch (e) {
                expect(e).toBeInstanceOf(NotFoundException)
            }
        });
    });

    describe("delete()", () => {
        it("should delete successfully", async () => {
            (repository.delete as jest.Mock).mockResolvedValue({
                affected: 1,
            });

            await expect(dao.delete(1)).resolves.toBeUndefined();

            expect(repository.delete).toBeCalledWith(1);
        });

        it("should throw NotFoundException when nothing deleted", async () => {
            (repository.delete as jest.Mock).mockResolvedValue({
                affected: 0,
            });
            try {
                await dao.delete(1);
                expect(true).toBeFalsy();
            }catch (e) {
                expect(e).toBeInstanceOf(NotFoundException)
            }
        });
    });

    describe("find()", () => {
        it("should return list of streamings", async () => {
            const items = [
                { id: 1, title: "A", description: null },
                { id: 2, title: "B", description: "desc" },
            ];

            (repository.findAndCount as jest.Mock).mockResolvedValue([
                items,
                2,
            ]);

            const result = await dao.find({
                query: {},
                sort: { field: "created_at", order: "asc" },
                page: 1,
                limit: 10,
            } as any);

            expect(repository.findAndCount).toBeCalled();
            expect(result.total).toBe(2);
            expect(result.streamings.length).toBe(2);
        });
    });

    describe("update()", () => {
        it("should update streaming item", async () => {
            const existing = { id: 1, title: "old" };
            const updated = { id: 1, title: "new" };

            jest.spyOn(dao, "findOne").mockResolvedValue(existing as any);
            (repository.save as jest.Mock).mockResolvedValue(updated);

            const result = await dao.update(1, {
                title: "new",
            } as any);

            expect(repository.save).toBeCalled();
            expect(result.title).toBe("new");
        });

        it("should throw NotFoundException when streaming item not exists", async () => {
            const existing = { id: 1, title: "old" };

            jest.spyOn(dao, "findOne").mockRejectedValue(new NotFoundException());
            (repository.save as jest.Mock);

            try{
                await dao.update(1, {
                    title: "new",
                } as any);
                expect(true).toBeFalsy()
            }catch (e) {
                expect(e).toBeInstanceOf(NotFoundException)
            }
            expect(repository.save).toBeCalledTimes(0);
        });
    });
});