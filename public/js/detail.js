$(function(){
	$('.comment').click(function(e){
		var target = $(this);
		var toId = target.data('tid');
		var commentId = target.data('cid');
		//插入隐藏域
		//作是否插入过的判断
		if($("#toId").length > 0) {
           $("#toId").val(toId);
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'toId',
				name:'comment[tid]',
				value:toId
		    }).appendTo('#commentForm')
		}
		
		if($("#commentId").length > 0) {
			$("#commentId").val(commentId);
		}else{
  			$('<input>').attr({
				type:'hidden',
				id:'commentId',
				name:'comment[cid]',
				value:commentId
			}).appendTo('#commentForm')
		}		
	})
})