import { Test, TestingModule } from "@nestjs/testing";
import { Logger } from "@nestjs/common";
import {CreateStreamingService} from "./create.streaming.service";
import {StreamingDao} from "../dao/streaming.dao";
import {getStreamingWithDetailsResponse2} from "../../../../test/mock/api/responses";
import {createStreamingValidRequest} from "../../../../test/mock/api/requests";
import {CreateStreamingDto} from "../dto/CreateStreaming.dto";
import {GetStreamingDetailsDto} from "../dto/GetStreamingDetails.dto";


describe("Streaming Create Service", () => {
    let service: CreateStreamingService;
    let streamingDaoImpl: StreamingDao;
    let module: TestingModule;
    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                CreateStreamingService,
                Logger,
                {
                    provide: 'streamingDaoImpl',
                    useValue: {
                        create: jest.fn(),
                    }
                }
            ]
        })
            .compile();

        streamingDaoImpl = module.get<StreamingDao>("streamingDaoImpl");
        service = module.get<CreateStreamingService>(CreateStreamingService);
    });


    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("createStreaming()", () => {
        it("should successfully create a Streaming ", async () => {
            jest
                .spyOn(streamingDaoImpl, 'create')
                .mockResolvedValue(getStreamingWithDetailsResponse2);
            const payload :CreateStreamingDto = JSON.parse((JSON.stringify(createStreamingValidRequest)));
            const response : GetStreamingDetailsDto = await service.create(  payload );
            expect(streamingDaoImpl.create).toBeCalledWith( payload);
            expect(response).toBe(getStreamingWithDetailsResponse2)
        });

    });
});
