import { Test, TestingModule } from "@nestjs/testing";
import { Logger, NotFoundException } from "@nestjs/common";
import {DeleteStreamingService} from "./delete.streaming.service";
import {StreamingDao} from "../dao/streaming.dao";
import {getStreamingWithDetailsResponse2} from "../../../../test/mock/api/responses";


describe("Streaming Delete Service", () => {
    let service: DeleteStreamingService;
    let streamingDaoImpl: StreamingDao;
    let module: TestingModule;
    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                DeleteStreamingService,
                Logger,
                {
                    provide: 'streamingDaoImpl',
                    useValue: {
                        delete: jest.fn(),
                    }
                }
            ]
        })
            .compile();

        streamingDaoImpl = module.get<StreamingDao>("streamingDaoImpl");
        service = module.get<DeleteStreamingService>(DeleteStreamingService);
    });


    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("deleteStreaming()", () => {
        it("should successfully delete a Streaming ", async () => {
            jest
                .spyOn(streamingDaoImpl, 'delete')
                .mockResolvedValue(undefined);
            const streamingId:number = getStreamingWithDetailsResponse2.id;
            await service.delete(             streamingId         );
            expect(streamingDaoImpl.delete).toBeCalledWith(streamingId)
        });


        it("should throw NotFoundException if streaming not exists from dao", async () => {
            const expectedErrorMessage:string = 'Streaming not exists';
            const streamingId:number = getStreamingWithDetailsResponse2.id;

            jest
                .spyOn(streamingDaoImpl, "delete")
                .mockRejectedValue(new NotFoundException(expectedErrorMessage));
            try {
                await service.delete(streamingId);
                expect(true).toBe(false);
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toBe(expectedErrorMessage);
            }
            expect(streamingDaoImpl.delete).toBeCalledWith(streamingId)
        });
    });
});
