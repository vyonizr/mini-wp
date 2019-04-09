function fetchAMenu(targetMenuId, previousMenuId) {
  $(`${previousMenuId}`).show()
  $(`${targetMenuId}`).show()
}
$("#create-an-article-page").show()
$("#blog-posts-page").hide()

$(document).ready(function() {
  $('#summernote').summernote({
    placeholder: 'Hello bootstrap 4',
    tabsize: 2,
    height: 300
  });
});

$("#reveal-create-an-article-page").on("click", () => {
  $("#create-an-article-page").show()
  $("#blog-posts-page").hide()
})

$("#reveal-blog-posts-page").on("click", () => {
  $("#blog-posts-page").show()
  $("#create-an-article-page").hide()
})