import { Test, TestingModule } from "@nestjs/testing";
import { Logger } from "@nestjs/common";
import {FindStreamingService} from "./find.streaming.service";
import {StreamingDao} from "../dao/streaming.dao";
import {findStreamingsResponse} from "../../../../test/mock/api/responses";
import {SortOptions, SortOrder} from "../../../api/model/SortOptions";
import {FindOptions} from "../../../api/model/FindOptions";
import {ListStreamingDto} from "../dto/ListStreaming.dto";


describe("Streaming Find Service", () => {
    let service: FindStreamingService;
    let streamingDaoImpl: StreamingDao;
    let module: TestingModule;
    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                FindStreamingService,
                Logger,
                {
                    provide: 'streamingDaoImpl',
                    useValue: {
                        find: jest.fn(),
                    }
                }
            ]
        })
            .compile();

        streamingDaoImpl = module.get<StreamingDao>("streamingDaoImpl");
        service = module.get<FindStreamingService>(FindStreamingService);
    });


    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("findStreaming()", () => {
        it("should successfully find Streamings ", async () => {

            const filters :any = {genre:'drama'};
            const page:number = 1;
            const limit:number = 2;
            const sort: SortOptions = {
                order:SortOrder.ASC,
                field:'created_at'
            }
            const findOptions : FindOptions = {
                query: filters,
                sort:sort,
                page:page,
                limit:limit
            }
            jest
                .spyOn(streamingDaoImpl, 'find')
                .mockResolvedValue(findStreamingsResponse);
            const response :ListStreamingDto =  await service.find(  findOptions );
            expect(streamingDaoImpl.find).toBeCalledWith( findOptions);
            expect(response).toBe(findStreamingsResponse);
        });

    });
});
