using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;

namespace JobPosting.Models
{
    public class JobModel
    {
        private ApplicationDbContext _context;

        public JobModel()
        {
            _context = new ApplicationDbContext(); 
        }

        public IEnumerable<JobViewModel> GetPostedJobs(string userId="")
        {
            Expression<Func<Job, bool>> exp = e => !string.IsNullOrEmpty(userId)
              ? (e.UserId.Contains(userId))
              : e.Id != 0;

            var PostedJobs = (from jobs in _context.Job.Where(exp)
                              select new JobViewModel
                              {
                                    Id = jobs.Id,
                                    Title = jobs.Title,
                                    Description = jobs.Description,
                                    ContactEmail = jobs.ContactEmail
                              }).ToList();

            return PostedJobs; 
        }
    }
}