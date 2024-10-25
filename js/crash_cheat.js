var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        document.title = 'ヽ(●-`Д´-)ノ你丑你就走！';
        clearTimeout(titleTime);
    }
    else {
        document.title = '你帅就回来ヾ(Ő∀Ő3)ノ！';
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 5000);
    }
});

