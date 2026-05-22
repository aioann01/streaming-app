import {ALLOWED_FILTER_FIELDS, ALLOWED_SORT_FIELDS} from "./dto/ListStreaming.dto";


export const deleteStreamingDescription = `<p>This operation deletes a Streaming entity based on id. </p>
`;

export const getStreamingDescription = `<p>This operation retrieves a Streaming entity.</p>
`;

export const findStreamingsDescription = `<p>This operation retrieves a list of Streamings</p>
<p>Filtering Can be Applied to this API with <b>streaming?{field_1}={value_1}&{field_2}={value_2}&..{field_N}={value_N}</b> syntax. e.g: <i>streaming?&billingAccountRef.id=123</i> SupportedQueryFields : ${ALLOWED_FILTER_FIELDS}</p>
`;

export const updateStreamingDescription = `<p>This operation performs partial update of a Streaming.</p>
`;

export const createStreamingDescription = `<p>This operation creates a Streaming entity .</p>
<div>
    <p>Streaming validation ensures that the Streaming's data are correct and fulfill the validity rules applied for them.<br>
  The Streaming cannot be created if the given data does not fulfil the validations
  Some validations are:
  <ul>
  <li><i>[thumbnail_url]</i> should be not empty and valid url </li>
  <li><i>[video_url]</i> should be not empty and valid url </li>
  <li><i>[title]</i> should be not empty</li>
  </ul>
</div>
`;

export const queryParams:any = {
    Limit: {name: 'limit', required: false, example: 10},
    Page: {name: 'page', required: false, example: 1},
    Sort :{    name: 'sort',
        required: false,
        description:
            `Sorting can be applied with this syntax : sort={fieldName1}.{sortOrderForField1},{fieldName2}.{sortOrderForField2},...{fieldNameX}.{sortOrderForFieldX}   
SupportedOrders: [asc,desc]
 SupportedFields : ${ALLOWED_SORT_FIELDS}`,
        example: 'created_at.asc'}

}
