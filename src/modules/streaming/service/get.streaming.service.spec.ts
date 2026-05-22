import { Test, TestingModule } from "@nestjs/testing";
import { Logger, NotFoundException } from "@nestjs/common";
import {GetStreamingService} from "./get.streaming.service";
import {StreamingDao} from "../dao/streaming.dao";
import {GetStreamingDetailsDto} from "../dto/GetStreamingDetails.dto";
import {getStreamingWithDetailsResponse2} from "../../../../test/mock/api/responses";


describe("Streaming Retrieve Service", () => {
    let service: GetStreamingService;
    let streamingDaoImpl: StreamingDao;
    let module: TestingModule;
    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                GetStreamingService,
                Logger,
                {
                    provide: 'streamingDaoImpl',
                    useValue: {
                        findOne: jest.fn(),
                    }
                }
            ]
        })
            .compile();

        streamingDaoImpl = module.get<StreamingDao>("streamingDaoImpl");
        service = module.get<GetStreamingService>(GetStreamingService);
    });


    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("getStreaming()", () => {
        it("should successfully retrieve a Streaming ", async () => {
            jest
                .spyOn(streamingDaoImpl, 'findOne')
                .mockResolvedValue(getStreamingWithDetailsResponse2);
            const streamingId:number = getStreamingWithDetailsResponse2.id;
            const result: GetStreamingDetailsDto = await service.get(
                streamingId
            );
            expect(result).toEqual(getStreamingWithDetailsResponse2);
            expect(streamingDaoImpl.findOne).toBeCalledWith(streamingId)
        });


        it("should throw NotFoundException if streaming not exists from dao", async () => {
            const expectedErrorMessage:string = 'Streaming not exists';
            const streamingId:number = getStreamingWithDetailsResponse2.id;

            jest
                .spyOn(streamingDaoImpl, "findOne")
                .mockRejectedValue(new NotFoundException(expectedErrorMessage));
            try {
                await service.get(streamingId);
                expect(true).toBe(false);
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toBe(expectedErrorMessage);
            }
            expect(streamingDaoImpl.findOne).toBeCalledWith(streamingId)
        });
    });
});
