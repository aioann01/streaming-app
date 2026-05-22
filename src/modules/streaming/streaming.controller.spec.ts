import {Test} from '@nestjs/testing';
import {StreamingController} from "./Streaming.controller";
import {BadRequestException, Logger} from "@nestjs/common";
import {CreateStreamingService} from "./service/create.streaming.service";
import {FindStreamingService} from "./service/find.streaming.service";
import {UpdateStreamingService} from "./service/update.streaming.service";
import {DeleteStreamingService} from "./service/delete.streaming.service";
import {GetStreamingService} from "./service/get.streaming.service";
import {findStreamingsResponse, getStreamingWithDetailsResponse1} from "../../../test/mock/api/responses";
import {TotalCountInterceptor} from "./../../api/interceptor/totalCount.interceptor";
import {LocationInterceptor} from "./../../api/interceptor/location.interceptor";
import {
    createStreamingRequestWithInvalidThumbnailUrl,
    createStreamingRequestWithInvalidVideoUrl,
    createStreamingValidRequest,
    updateStreamingValidRequest
} from "../../../test/mock/api/requests";
import {FindOptions} from "../../api/model/FindOptions";
import {SortOptions, SortOrder} from "../../api/model/SortOptions";


describe('Streaming Controller', () => {
    let createStreamingService: CreateStreamingService;
    let updateStreamingService: UpdateStreamingService;
    let findStreamingService: FindStreamingService;
    let deleteStreamingService: DeleteStreamingService;
    let getStreamingService: GetStreamingService;
    let controller : StreamingController;


    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers:     [
                Logger,
                {
                    provide : FindStreamingService,
                    useFactory: () =>({
                        find: jest.fn().mockImplementation(() => findStreamingsResponse)
                    })
                },
                {
                    provide : DeleteStreamingService,
                    useFactory: () =>({
                        delete: jest.fn().mockImplementation(() => null
                        )
                    })
                },
                {
                    provide : CreateStreamingService,
                    useFactory: () =>({
                        create: jest.fn().mockImplementation(() => getStreamingWithDetailsResponse1)
                    })
                },
                {
                    provide : UpdateStreamingService,
                    useFactory: () =>({
                        update: jest.fn().mockImplementation(()  => getStreamingWithDetailsResponse1),
                    })
                },
                {
                    provide : GetStreamingService,
                    useFactory: () =>({
                        get: jest.fn().mockImplementation(() => getStreamingWithDetailsResponse1),
                    })
                },
            ],
            controllers: [StreamingController],
        })

            .overrideInterceptor(TotalCountInterceptor)
            .useValue(  {  intercept :   jest.fn()})
            .overrideInterceptor(LocationInterceptor)
            .useValue(  {  intercept :   jest.fn()})
            .compile();
        createStreamingService = module.get<CreateStreamingService>(
            CreateStreamingService);
        updateStreamingService = module.get<UpdateStreamingService>(
            UpdateStreamingService);
        getStreamingService = module.get<GetStreamingService>(
            GetStreamingService);
        findStreamingService = module.get<FindStreamingService>(
            FindStreamingService);
        deleteStreamingService = module.get<DeleteStreamingService>(
            DeleteStreamingService);
        controller = module.get<StreamingController>(
            StreamingController
        );
    });


    describe('Create Streaming', () => {
        it('should successfully create a Streaming', async () => {

            jest.spyOn(createStreamingService, 'create');
            const response = await controller.create(createStreamingValidRequest );
            expect(createStreamingService.create).toBeCalledWith(createStreamingValidRequest);
            expect(response).toBe(getStreamingWithDetailsResponse1);
        });
    });

    describe('Retrieve Streaming', () => {
        it('should successfully retrieve a Streaming', async () => {

            jest.spyOn(getStreamingService, 'get');
            const mockStreamingId:string = '2';
            const response = await controller.getOne(mockStreamingId);
            expect(getStreamingService.get).toBeCalledWith(+mockStreamingId);
            expect(response).toBe(getStreamingWithDetailsResponse1);
        });
    });

    describe('Find a Streaming', () => {
        it('should successfully list Streamings', async () => {
            const filters :any = {genre:'drama'};
            const page:number = 1;
            const limit:number = 2;
            const sort: SortOptions = {
                order:SortOrder.ASC,
                field:'created_at'
            }
            const expectedFindOptions : FindOptions = {
                query: filters,
                sort:sort,
                page:page,
                limit:limit
            }
            jest.spyOn(findStreamingService, 'find');
            const response = await controller.find(page, limit, filters, sort);
            expect(findStreamingService.find).toBeCalledWith(
                expectedFindOptions
            );
            expect(response).toBe(findStreamingsResponse);
        });
    });

    describe('Update a Streaming', () => {
        it('should successfully patch a Streaming', async () => {
            const mockStreamingId:string = '2';
            jest.spyOn(updateStreamingService, 'update');
            const response = await controller.update(mockStreamingId, updateStreamingValidRequest);
            expect(updateStreamingService.update).toBeCalledWith(+mockStreamingId, updateStreamingValidRequest);
            expect(response).toBe(getStreamingWithDetailsResponse1);
        });
    });

    describe('Deletes a Streaming', () => {
        it('should successfully delete a Streaming', async () => {
            const mockStreamingId:string = '2';

            jest.spyOn(deleteStreamingService, 'delete');
            await controller.delete(mockStreamingId );
            expect(deleteStreamingService.delete).toBeCalledWith(+mockStreamingId);
        });
    });

});
