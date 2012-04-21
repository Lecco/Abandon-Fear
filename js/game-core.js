(function ($)
{
  $.fn.extend(
  {
    zombie-game: function(options)
    {
      var defaults = {
        sizeX : 20,
        sizeY : 20
      }

      var options = $.extend(defaults, options);

      return this.each(function()
      {
        var o = options;

        // alert(o.sizeX);
      });
    }
  });
})(jQuery);
