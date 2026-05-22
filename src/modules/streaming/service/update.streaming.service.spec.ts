import { Test, TestingModule } from "@nestjs/testing";
import { Logger, NotFoundException } from "@nestjs/common";
import {UpdateStreamingService} from "./update.streaming.service";
import {StreamingDao} from "../dao/streaming.dao";
import {getStreamingWithDetailsResponse2} from "../../../../test/mock/api/responses";
import {updateStreamingValidRequest} from "../../../../test/mock/api/requests";
import {UpdateStreamingDto} from "../dto/UpdateStreaming.dto";
import {GetStreamingDetailsDto} from "../dto/GetStreamingDetails.dto";


describe("Streaming Update Service", () => {
    let service: UpdateStreamingService;
    let streamingDaoImpl: StreamingDao;
    let module: TestingModule;
    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                UpdateStreamingService,
                Logger,
                {
                    provide: 'streamingDaoImpl',
                    useValue: {
                        update: jest.fn(),
                    }
                }
            ]
        })
            .compile();

        streamingDaoImpl = module.get<StreamingDao>("streamingDaoImpl");
        service = module.get<UpdateStreamingService>(UpdateStreamingService);
    });


    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("updateStreaming()", () => {
        it("should successfully update a Streaming ", async () => {
            jest
                .spyOn(streamingDaoImpl, 'update')
                .mockResolvedValue(getStreamingWithDetailsResponse2);
            const payload :UpdateStreamingDto = JSON.parse((JSON.stringify(updateStreamingValidRequest)));
            const streamingId:number = getStreamingWithDetailsResponse2.id;
            const response : GetStreamingDetailsDto = await service.update( streamingId, payload );
            expect(streamingDaoImpl.update).toBeCalledWith(streamingId, payload);
            expect(response).toBe(getStreamingWithDetailsResponse2);
        });


        it("should throw NotFoundException if streaming not exists from dao", async () => {
            const expectedErrorMessage:string = 'Streaming not exists';
            const streamingId:number = getStreamingWithDetailsResponse2.id;
            const payload :UpdateStreamingDto = JSON.parse((JSON.stringify(updateStreamingValidRequest)));

            jest
                .spyOn(streamingDaoImpl, "update")
                .mockRejectedValue(new NotFoundException(expectedErrorMessage));
            try {
                await service.update(streamingId, payload);
                expect(true).toBe(false);
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toBe(expectedErrorMessage);
            }
            expect(streamingDaoImpl.update).toBeCalledWith(streamingId, payload)
        });
    });
});
