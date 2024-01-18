$(document).ready(function() {
    var currentPage = 1;
    var repositoriesPerPage = 10;

    $('#githubForm').submit(function(event) {
        event.preventDefault();
        var username = $('#usernameInput').val();
        currentPage = 1;
        repositoriesPerPage = 10;
        fetchRepositories(username);
    });

    function fetchRepositories(username) {
        var apiUrl = `https://api.github.com/users/${username}/repos`;
        apiUrl += `?per_page=${repositoriesPerPage}&page=${currentPage}`;
        $('#repoList').empty();
       
        $('#loader').show();

        $.get(apiUrl, function(repositories) {
            $('#loader').hide();
            
            if (repositories.length > 0) {
                displayRepositories(repositories);
                displayPagination(repositories.length);
            } else {
                $('#repoList').html('<div class="col-12 text-center">No repositories found.</div>');
            }
        }).fail(function() {
            $('#repoList').html('<div class="col-12 text-center">Failed to fetch repositories. Please try again later.</div>');
        });
    }

    function displayRepositories(repositories) {
        $('#repoList').empty();
        var repoGrid = '<div class="row">';
        
        repositories.forEach(function(repo) {
            var repoCard = `
                <div class="col-md-4">
                    <div class="repo-card">
                        <h5>${repo.name}</h5>
                        <p>${repo.description || 'No description available.'}</p>
                        <a href="${repo.html_url}" target="_blank" class="btn btn-primary">View on GitHub</a>
                    </div>
                </div>
            `;
            repoGrid += repoCard;
        });

        repoGrid += '</div>';
        $('#repoList').append(repoGrid);
    }

    function displayPagination(totalRepositories) {
        var totalPages = Math.ceil(totalRepositories / repositoriesPerPage);
        $('#pagination').remove();
        var pagination = '<ul class="pagination justify-content-center" id="pagination">';
        for (var i = 1; i <= totalPages; i++) {
            pagination += `<li class="page-item ${currentPage === i ? 'active' : ''}"><a class="page-link" href="#" data-page="${i !== currentPage ? i : '#'}">${i}</a></li>`;
        }
        pagination += '</ul>';
        $('#repoList').after(pagination);

        $('#pagination a').click(function(event) {
            event.preventDefault();
            currentPage = parseInt($(this).data('page'));
            fetchRepositories($('#usernameInput').val());
        });
    }
});
