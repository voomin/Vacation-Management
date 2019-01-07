var hm_rest_table={
    column:['rest_index', ' sub_name', ' stu_number', ' stu_name', 'rest_num', 'rest_request_date', 'rest_date', 'rest_reason', 'stu_check', 'manage_check', 'verified']
};
module.exports = function () {
    return {
        hm_rest_table_insert:function(values){
            var sql='INSERT INTO hm_rest_table VALUES (';
            sql+=values.map((val)=>val).join(',')+")";
            return sql;
        }
    }
}