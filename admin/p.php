
const response = await fetch('http://localhost/abc/zyx.php');


{
    data: {
        [{name: 'sarim'}, {name: 'tayyab'}]
    };
    status: 200;
    message: "users fetched successfuly";
}

response.data = 
response.status =
response.message = 

{
    data: {
        count: {
            "total_properties": "10",
            "total_users": "23"
        },
        status: 200,
        message: "counts fetched successfully"
    },
}