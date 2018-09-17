namespace JobPosting.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateJobsTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Jobs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        Description = c.String(),
                        ContactEmail = c.String(),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Jobs");
        }
    }
}
