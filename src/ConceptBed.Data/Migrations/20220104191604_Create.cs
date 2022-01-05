using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConceptBed.Data.Migrations
{
    /// <inheritdoc/>
    public partial class Create : Migration
    {
        /// <inheritdoc/>
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "forecasts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    temperature = table.Column<int>(type: "INTEGER", nullable: false),
                    summary = table.Column<string>(type: "TEXT", maxLength: 512, nullable: false, collation: "NOCASE"),
                    status = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_forecasts", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "forecastdeltas",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    forecast_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    delta = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_forecastdeltas", x => x.id);
                    table.ForeignKey(
                        name: "FK_forecastdeltas_forecasts_forecast_id",
                        column: x => x.forecast_id,
                        principalTable: "forecasts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("00d2ecb6-ea0b-4d73-a087-a30a2d580150"), new DateTime(2022, 2, 15, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3229), 0, "Bracing", -18 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("03168dd9-83e4-4f53-b781-a8c8dbdc6e16"), new DateTime(2022, 2, 12, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3197), 0, "Mild", -7 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("0e774bcb-05f5-4eed-9d9d-883947c34442"), new DateTime(2022, 2, 20, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3239), 0, "Cool", 33 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("16cdf4f5-88c4-4f42-a86b-28987d13fb2c"), new DateTime(2022, 1, 12, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3136), 0, "Scorching", -6 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("1bcbc2e0-6b6e-4155-9164-c66e397c1a71"), new DateTime(2022, 1, 9, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3130), 0, "Chilly", -17 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("1d6065c5-c276-4c7b-ba7a-efd7554c4a03"), new DateTime(2022, 1, 10, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3132), 0, "Warm", 27 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("20b1bdc1-2002-4126-9194-6a05f6b5be22"), new DateTime(2022, 1, 18, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3148), 0, "Bracing", 8 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("2e6de217-1ad4-4534-ad33-8e94af532c57"), new DateTime(2022, 1, 31, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3173), 0, "Bracing", -6 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("385efb01-53ac-4aa0-8073-4ed268cd74b4"), new DateTime(2022, 1, 17, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3146), 0, "Cool", 4 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("3e91b042-9666-4baa-bb1d-5057e1b614eb"), new DateTime(2022, 2, 16, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3231), 0, "Warm", 48 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("3f081475-12c0-4b4c-8f97-cbe7e54e9034"), new DateTime(2022, 2, 19, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3237), 0, "Cool", 20 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("4006dac0-c81d-402d-8569-43b6eb577e7e"), new DateTime(2022, 1, 7, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3125), 0, "Scorching", 28 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("4a50a294-1da6-45ab-928b-ed1ee39f96bf"), new DateTime(2022, 2, 17, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3233), 0, "Chilly", 35 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("4ceebb94-2283-47db-9257-245160b03736"), new DateTime(2022, 1, 25, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3162), 0, "Freezing", -18 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("4d17393b-bcbe-40fa-b7d2-acb507c2e9b4"), new DateTime(2022, 2, 2, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3177), 0, "Freezing", 39 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("522b2308-f0ca-46e0-a03e-565b959bc4c1"), new DateTime(2022, 1, 29, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3169), 0, "Scorching", -10 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("531eb79c-d3bc-47d4-ac88-24a0fc9bb0c7"), new DateTime(2022, 1, 8, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3127), 0, "Hot", 11 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("5cf9c4b5-11db-42ad-afb8-3941c533ad80"), new DateTime(2022, 1, 27, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3165), 0, "Mild", 10 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("63064af7-4fce-413a-b102-e0560701cd21"), new DateTime(2022, 1, 6, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3123), 0, "Freezing", -14 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("71135c31-128e-43d6-88fa-8184f4bf7369"), new DateTime(2022, 2, 11, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3195), 0, "Balmy", 1 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("7f68b18c-72a1-468f-b55f-8b19d6a0db93"), new DateTime(2022, 1, 30, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3171), 0, "Balmy", 13 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("926c36d9-2371-48d5-a793-affd5529d7e5"), new DateTime(2022, 1, 24, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3160), 0, "Hot", 10 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("94c48419-63de-4743-8198-a06755d8ee6a"), new DateTime(2022, 2, 14, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3227), 0, "Mild", 20 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("9d0a0f32-9ac9-4890-b23c-e7188ba6f6de"), new DateTime(2022, 2, 13, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3199), 0, "Cool", 22 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("9d15b3ff-1c3b-4e29-9568-528fdf662752"), new DateTime(2022, 2, 1, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3175), 0, "Cool", -9 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("9ed991da-6acc-430e-a2e8-f4087fdc829d"), new DateTime(2022, 2, 5, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3183), 0, "Bracing", 40 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("a1ff6cd0-33b0-4631-b92b-ac3f41a2218b"), new DateTime(2022, 1, 16, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3144), 0, "Scorching", -16 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("a30af001-2c7e-489f-9f40-6ffe301bba76"), new DateTime(2022, 2, 9, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3191), 0, "Scorching", 34 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("a6dbfbd6-68f7-4bb0-8e03-ad90a9a1e723"), new DateTime(2022, 1, 11, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3134), 0, "Bracing", -16 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("aa4d900b-02fa-4ba4-810a-536fd527f5d9"), new DateTime(2022, 2, 4, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3181), 0, "Scorching", -5 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("b19977e1-5244-430f-92da-f63d327e3656"), new DateTime(2022, 1, 13, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3138), 0, "Balmy", -3 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("be2569f0-433f-4345-ac74-d6ffa327f187"), new DateTime(2022, 2, 6, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3185), 0, "Chilly", -4 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("c017fb43-9ded-4628-b994-ecbb9536f937"), new DateTime(2022, 1, 20, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3152), 0, "Chilly", -10 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("c73ee724-894b-4e9c-8793-30d3e948f0c8"), new DateTime(2022, 2, 21, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3240), 0, "Scorching", 7 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("cef08291-9415-428c-8985-35116ddcb8ee"), new DateTime(2022, 2, 8, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3189), 0, "Freezing", 33 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("cfa22e8c-764d-43d5-8774-95df3a5d7a3e"), new DateTime(2022, 1, 22, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3156), 0, "Freezing", -20 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("d3cfee22-66dc-4828-90fb-1c8ee7627355"), new DateTime(2022, 2, 18, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3235), 0, "Scorching", -12 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("d4fe1aa7-79f3-45c2-ba10-14fb61d5b9e2"), new DateTime(2022, 1, 15, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3142), 0, "Balmy", 29 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("d612a7b5-97e1-46a0-aaeb-9e2a22638ca8"), new DateTime(2022, 1, 23, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3158), 0, "Warm", -10 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("deabb045-cb23-43d7-836d-6ac10e3f5dcd"), new DateTime(2022, 1, 14, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3141), 0, "Bracing", 48 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("e09a90de-3b62-446f-a494-ca61c7d55a4a"), new DateTime(2022, 1, 19, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3150), 0, "Freezing", 41 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("e5526ad2-2ec5-428a-b1dc-0d45878bacfc"), new DateTime(2022, 1, 5, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3120), 0, "Chilly", 36 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("eeaf645c-3eb3-4c95-8d12-60b8d4a31bf9"), new DateTime(2022, 1, 21, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3154), 0, "Balmy", 29 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("f09748d7-cc12-4bfc-9a6d-baf18fa87899"), new DateTime(2022, 2, 3, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3179), 0, "Warm", 42 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("f2161019-dabc-4539-9d14-7a82ee4e67af"), new DateTime(2022, 2, 7, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3187), 0, "Freezing", 4 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("f6d40bcb-9cf8-472a-9b9e-e31bcf75e3fe"), new DateTime(2022, 1, 4, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3080), 0, "Bracing", -16 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("f8354bd6-0e09-4961-b199-a882a0f1069d"), new DateTime(2022, 2, 10, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3193), 0, "Chilly", 22 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("fb1f0f5d-4683-44ea-a805-437523e1289b"), new DateTime(2022, 1, 28, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3167), 0, "Cool", 46 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("fe1e9320-baeb-4561-88de-e11694387c91"), new DateTime(2022, 2, 22, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3243), 0, "Warm", 17 });

            migrationBuilder.InsertData(
                table: "forecasts",
                columns: new[] { "id", "date", "status", "summary", "temperature" },
                values: new object[] { new Guid("ff49ac02-60b2-44f4-bb63-c54dcecf28c9"), new DateTime(2022, 1, 26, 20, 16, 4, 625, DateTimeKind.Local).AddTicks(3163), 0, "Chilly", 31 });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 783812, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3454), 3, new Guid("eeaf645c-3eb3-4c95-8d12-60b8d4a31bf9") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 6203975, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3427), -3, new Guid("00d2ecb6-ea0b-4d73-a087-a30a2d580150") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 17191306, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3455), 8, new Guid("7f68b18c-72a1-468f-b55f-8b19d6a0db93") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 32725701, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3439), -4, new Guid("7f68b18c-72a1-468f-b55f-8b19d6a0db93") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 47892527, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3446), 1, new Guid("1d6065c5-c276-4c7b-ba7a-efd7554c4a03") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 48237451, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3411), -10, new Guid("0e774bcb-05f5-4eed-9d9d-883947c34442") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 79300082, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3395), 7, new Guid("ff49ac02-60b2-44f4-bb63-c54dcecf28c9") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 85068063, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3424), 9, new Guid("7f68b18c-72a1-468f-b55f-8b19d6a0db93") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 86466933, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3402), 0, new Guid("f6d40bcb-9cf8-472a-9b9e-e31bcf75e3fe") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 98769182, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3392), -10, new Guid("03168dd9-83e4-4f53-b781-a8c8dbdc6e16") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 119057504, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3443), -8, new Guid("4d17393b-bcbe-40fa-b7d2-acb507c2e9b4") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 132471460, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3429), -3, new Guid("f8354bd6-0e09-4961-b199-a882a0f1069d") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 138568179, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3419), 1, new Guid("522b2308-f0ca-46e0-a03e-565b959bc4c1") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 139790624, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3441), -9, new Guid("ff49ac02-60b2-44f4-bb63-c54dcecf28c9") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 216050304, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3437), -10, new Guid("1d6065c5-c276-4c7b-ba7a-efd7554c4a03") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 216723576, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3429), -7, new Guid("9ed991da-6acc-430e-a2e8-f4087fdc829d") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 218105496, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3400), -3, new Guid("20b1bdc1-2002-4126-9194-6a05f6b5be22") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 219813315, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3404), -4, new Guid("ff49ac02-60b2-44f4-bb63-c54dcecf28c9") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 233536560, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3445), -9, new Guid("fb1f0f5d-4683-44ea-a805-437523e1289b") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 255177018, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3421), 1, new Guid("1bcbc2e0-6b6e-4155-9164-c66e397c1a71") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 269892388, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3447), -5, new Guid("c017fb43-9ded-4628-b994-ecbb9536f937") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 280214241, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3384), -6, new Guid("63064af7-4fce-413a-b102-e0560701cd21") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 280883664, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3410), -8, new Guid("63064af7-4fce-413a-b102-e0560701cd21") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 289972459, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3455), -9, new Guid("b19977e1-5244-430f-92da-f63d327e3656") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 295178657, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3389), -3, new Guid("f6d40bcb-9cf8-472a-9b9e-e31bcf75e3fe") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 324688154, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3445), -3, new Guid("f2161019-dabc-4539-9d14-7a82ee4e67af") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 353526859, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3398), -7, new Guid("fb1f0f5d-4683-44ea-a805-437523e1289b") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 385306698, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3416), 4, new Guid("e5526ad2-2ec5-428a-b1dc-0d45878bacfc") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 387581386, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3401), -5, new Guid("b19977e1-5244-430f-92da-f63d327e3656") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 410839834, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3412), 0, new Guid("3f081475-12c0-4b4c-8f97-cbe7e54e9034") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 434940346, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3422), 9, new Guid("4a50a294-1da6-45ab-928b-ed1ee39f96bf") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 545119316, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3394), -4, new Guid("4a50a294-1da6-45ab-928b-ed1ee39f96bf") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 554176475, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3408), 8, new Guid("4d17393b-bcbe-40fa-b7d2-acb507c2e9b4") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 572223304, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3452), 2, new Guid("d4fe1aa7-79f3-45c2-ba10-14fb61d5b9e2") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 590097170, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3437), -2, new Guid("20b1bdc1-2002-4126-9194-6a05f6b5be22") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 619049975, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3426), 1, new Guid("fb1f0f5d-4683-44ea-a805-437523e1289b") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 652621621, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3443), -10, new Guid("a6dbfbd6-68f7-4bb0-8e03-ad90a9a1e723") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 652681011, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3414), -8, new Guid("4006dac0-c81d-402d-8569-43b6eb577e7e") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 658766812, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3392), 0, new Guid("4a50a294-1da6-45ab-928b-ed1ee39f96bf") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 678146833, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3433), 2, new Guid("d4fe1aa7-79f3-45c2-ba10-14fb61d5b9e2") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 689914792, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3451), 0, new Guid("4006dac0-c81d-402d-8569-43b6eb577e7e") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 695372853, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3405), -5, new Guid("7f68b18c-72a1-468f-b55f-8b19d6a0db93") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 725382147, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3432), -3, new Guid("9d15b3ff-1c3b-4e29-9568-528fdf662752") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 739901873, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3440), -9, new Guid("a30af001-2c7e-489f-9f40-6ffe301bba76") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 766947535, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3400), 9, new Guid("4006dac0-c81d-402d-8569-43b6eb577e7e") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 773264466, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3416), 9, new Guid("4a50a294-1da6-45ab-928b-ed1ee39f96bf") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 786269710, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3395), -2, new Guid("531eb79c-d3bc-47d4-ac88-24a0fc9bb0c7") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 817945308, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3418), 4, new Guid("a6dbfbd6-68f7-4bb0-8e03-ad90a9a1e723") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 911872447, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3453), 1, new Guid("9d15b3ff-1c3b-4e29-9568-528fdf662752") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 968207206, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3448), 5, new Guid("be2569f0-433f-4345-ac74-d6ffa327f187") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 982515892, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3411), 4, new Guid("fb1f0f5d-4683-44ea-a805-437523e1289b") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1056475776, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3438), -9, new Guid("3e91b042-9666-4baa-bb1d-5057e1b614eb") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1066959401, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3441), 7, new Guid("94c48419-63de-4743-8198-a06755d8ee6a") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1076043683, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3423), -1, new Guid("cef08291-9415-428c-8985-35116ddcb8ee") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1299389449, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3415), 6, new Guid("531eb79c-d3bc-47d4-ac88-24a0fc9bb0c7") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1300586865, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3442), 9, new Guid("71135c31-128e-43d6-88fa-8184f4bf7369") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1313090666, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3396), -6, new Guid("a30af001-2c7e-489f-9f40-6ffe301bba76") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1320818638, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3403), -9, new Guid("9ed991da-6acc-430e-a2e8-f4087fdc829d") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1374352893, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3452), 7, new Guid("f8354bd6-0e09-4961-b199-a882a0f1069d") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1401203327, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3435), 6, new Guid("cef08291-9415-428c-8985-35116ddcb8ee") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1403308658, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3409), 8, new Guid("0e774bcb-05f5-4eed-9d9d-883947c34442") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1412936112, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3407), 6, new Guid("f6d40bcb-9cf8-472a-9b9e-e31bcf75e3fe") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1420761322, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3357), 6, new Guid("9ed991da-6acc-430e-a2e8-f4087fdc829d") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1450587950, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3405), -9, new Guid("cfa22e8c-764d-43d5-8774-95df3a5d7a3e") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1482429577, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3421), 2, new Guid("d4fe1aa7-79f3-45c2-ba10-14fb61d5b9e2") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1537085669, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3428), -1, new Guid("926c36d9-2371-48d5-a793-affd5529d7e5") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1544583733, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3419), 6, new Guid("5cf9c4b5-11db-42ad-afb8-3941c533ad80") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1583885227, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3446), -9, new Guid("2e6de217-1ad4-4534-ad33-8e94af532c57") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1604691917, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3403), -2, new Guid("c017fb43-9ded-4628-b994-ecbb9536f937") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1635030280, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3449), -2, new Guid("3f081475-12c0-4b4c-8f97-cbe7e54e9034") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1665336649, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3426), -7, new Guid("385efb01-53ac-4aa0-8073-4ed268cd74b4") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1684092101, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3393), 9, new Guid("ff49ac02-60b2-44f4-bb63-c54dcecf28c9") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1689081071, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3386), -6, new Guid("cfa22e8c-764d-43d5-8774-95df3a5d7a3e") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1781699236, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3431), 5, new Guid("9d0a0f32-9ac9-4890-b23c-e7188ba6f6de") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1784290922, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3417), 1, new Guid("1d6065c5-c276-4c7b-ba7a-efd7554c4a03") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1788084648, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3390), 6, new Guid("63064af7-4fce-413a-b102-e0560701cd21") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1795024923, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3439), -6, new Guid("4006dac0-c81d-402d-8569-43b6eb577e7e") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1800288968, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3406), -6, new Guid("a1ff6cd0-33b0-4631-b92b-ac3f41a2218b") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1808662283, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3424), 3, new Guid("63064af7-4fce-413a-b102-e0560701cd21") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1811087311, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3399), -10, new Guid("aa4d900b-02fa-4ba4-810a-536fd527f5d9") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1820343591, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3448), 0, new Guid("a30af001-2c7e-489f-9f40-6ffe301bba76") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1830872492, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3390), 0, new Guid("c73ee724-894b-4e9c-8793-30d3e948f0c8") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1870484471, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3434), -6, new Guid("4d17393b-bcbe-40fa-b7d2-acb507c2e9b4") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1875751644, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3412), -4, new Guid("fb1f0f5d-4683-44ea-a805-437523e1289b") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1876863775, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3456), -6, new Guid("7f68b18c-72a1-468f-b55f-8b19d6a0db93") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1899968073, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3388), -10, new Guid("1d6065c5-c276-4c7b-ba7a-efd7554c4a03") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1910023354, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3414), 6, new Guid("f8354bd6-0e09-4961-b199-a882a0f1069d") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1922473469, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3451), -10, new Guid("531eb79c-d3bc-47d4-ac88-24a0fc9bb0c7") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1927414160, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3396), 6, new Guid("00d2ecb6-ea0b-4d73-a087-a30a2d580150") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1942298856, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3413), -7, new Guid("7f68b18c-72a1-468f-b55f-8b19d6a0db93") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1953009193, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3430), -1, new Guid("16cdf4f5-88c4-4f42-a86b-28987d13fb2c") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 1980081103, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3386), 2, new Guid("cfa22e8c-764d-43d5-8774-95df3a5d7a3e") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 2011699160, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3385), 4, new Guid("a6dbfbd6-68f7-4bb0-8e03-ad90a9a1e723") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 2021716432, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3420), 3, new Guid("aa4d900b-02fa-4ba4-810a-536fd527f5d9") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 2027064651, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3406), -6, new Guid("cef08291-9415-428c-8985-35116ddcb8ee") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 2042247979, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3450), -5, new Guid("b19977e1-5244-430f-92da-f63d327e3656") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 2051865847, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3435), -1, new Guid("531eb79c-d3bc-47d4-ac88-24a0fc9bb0c7") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 2103768634, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3436), -6, new Guid("531eb79c-d3bc-47d4-ac88-24a0fc9bb0c7") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 2126267819, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3444), -4, new Guid("4006dac0-c81d-402d-8569-43b6eb577e7e") });

            migrationBuilder.InsertData(
                table: "forecastdeltas",
                columns: new[] { "id", "date", "delta", "forecast_id" },
                values: new object[] { 2126856789, new DateTime(2022, 1, 4, 19, 16, 4, 625, DateTimeKind.Utc).AddTicks(3425), 7, new Guid("c017fb43-9ded-4628-b994-ecbb9536f937") });

            migrationBuilder.CreateIndex(
                name: "IX_forecastdeltas_forecast_id",
                table: "forecastdeltas",
                column: "forecast_id");
        }

        /// <inheritdoc/>
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "forecastdeltas");

            migrationBuilder.DropTable(
                name: "forecasts");
        }
    }
}
