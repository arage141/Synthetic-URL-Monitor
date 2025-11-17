import { Box, Button, Checkbox, Stack, Typography } from "@mui/material";
import {
  Controller,
  type Control,
  type FieldErrors,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import type { FormType, URLObject } from "..";
import FloatingLabelInput from "./FloatingLabelInput";

interface AddUrlFormProps {
  handleSubmit: (
    onValid: SubmitHandler<{
      name: string;
      url: string;
      interval: string;
      timeout: string;
      expectedCodes: string;
      enabled?: boolean | undefined;
    }>,
    onInvalid?:
      | SubmitErrorHandler<{
          name: string;
          url: string;
          interval: string;
          timeout: string;
          expectedCodes: string;
          enabled?: boolean | undefined;
        }>
      | undefined
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;

  onSubmit: (data: FormType) => void;
  urlArray: URLObject[];
  reset: () => void;
  setEditingId: (id: string | null) => void;
  setShowForm: (show: boolean) => void;
  showForm: boolean;
  editingId: string | null;
  control: Control<
    {
      name: string;
      url: string;
      interval: string;
      timeout: string;
      expectedCodes: string;
      enabled?: boolean | undefined;
    },
    any,
    {
      name: string;
      url: string;
      interval: string;
      timeout: string;
      expectedCodes: string;
      enabled?: boolean | undefined;
    }
  >;
  errors: FieldErrors<{
    name: string;
    url: string;
    interval: string;
    timeout: string;
    expectedCodes: string;
    enabled?: boolean | undefined;
  }>;
  handleCancelForm: () => void;
  handleEditClick: (item: URLObject) => void;
  handleDeleteClick: (id: string) => void;
}
const AddUrlForm = ({
  handleSubmit,
  onSubmit,
  urlArray,
  reset,
  setEditingId,
  setShowForm,
  showForm,
  editingId,
  control,
  errors,
  handleCancelForm,
  handleEditClick,
  handleDeleteClick,
}: AddUrlFormProps) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            px: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1">URL Configurations</Typography>

            {urlArray.length > 0 && (
              <Button
                type="button"
                variant="contained"
                sx={{ fontSize: "0.9rem", width: "100px" }}
                onClick={() => {
                  reset();
                  setEditingId(null);
                  setShowForm(!showForm);
                }}
              >
                {showForm ? "Cancel" : "Add URL"}
              </Button>
            )}
          </Box>

          {/* scroll container: keeps form + list together and scrolls when needed */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              mt: 2,
              px: 1,
              // cap height relative to viewport on small screens so scrollbar appears
              maxHeight: { xs: "60vh", md: "450px" },
              WebkitOverflowScrolling: "touch",
            }}
          >
            {(showForm || urlArray.length === 0) && (
              <Stack
                spacing={1}
                sx={{
                  animation:
                    showForm || urlArray.length === 0
                      ? "slideDown 0.4s ease-out forwards"
                      : "slideUp 0.4s ease-out forwards",
                  overflow: "hidden",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {editingId ? "Edit URL" : "Add New URL"}
                </Typography>

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FloatingLabelInput
                      {...field}
                      label="Name"
                      placeholder="Enter URL Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ py: 0, bgcolor: "#FFFFFF" }}
                    />
                  )}
                />

                <Controller
                  name="url"
                  control={control}
                  render={({ field }) => (
                    <FloatingLabelInput
                      {...field}
                      label="URL"
                      placeholder="Enter URL"
                      error={!!errors.url}
                      helperText={errors.url?.message}
                      sx={{ py: 0, bgcolor: "#FFFFFF" }}
                    />
                  )}
                />

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Controller
                    name="interval"
                    control={control}
                    render={({ field }) => (
                      <FloatingLabelInput
                        {...field}
                        type="number"
                        inputProps={{ min: 0 }}
                        label="Interval"
                        placeholder="Enter interval in seconds"
                        error={!!errors.interval}
                        helperText={errors.interval?.message}
                        sx={{ flex: 1, py: 0, bgcolor: "#FFFFFF" }}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") field.onChange("");
                          else if (/^\d+$/.test(v)) {
                            field.onChange(Math.max(0, Number(v)).toString());
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            ![
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                              "Tab",
                            ].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="timeout"
                    control={control}
                    render={({ field }) => (
                      <FloatingLabelInput
                        {...field}
                        type="number"
                        inputProps={{ min: 0 }}
                        label="Timeout"
                        placeholder="Enter timeout in seconds"
                        error={!!errors.timeout}
                        helperText={errors.timeout?.message}
                        sx={{ flex: 1, py: 0, bgcolor: "#FFFFFF" }}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") field.onChange("");
                          else if (/^\d+$/.test(v)) {
                            field.onChange(Math.max(0, Number(v)).toString());
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            ![
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                              "Tab",
                            ].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    )}
                  />
                </Box>

                <Controller
                  name="expectedCodes"
                  control={control}
                  render={({ field }) => (
                    <FloatingLabelInput
                      {...field}
                      label="Expected Codes"
                      placeholder="Enter expected codes"
                      error={!!errors.expectedCodes}
                      helperText={errors.expectedCodes?.message}
                      sx={{ py: 0, bgcolor: "#FFFFFF" }}
                    />
                  )}
                />

                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Enabled (in maintenance if unchecked)
                      </Typography>
                    </Box>
                  )}
                />

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ fontSize: "0.9rem", px: 3 }}
                  >
                    {editingId ? "Update URL" : "Add URL"}
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{ fontSize: "0.9rem", px: 3 }}
                    onClick={handleCancelForm}
                  >
                    Cancel
                  </Button>
                </Box>
              </Stack>
            )}

            <Stack spacing={2} mt={2}>
              {urlArray &&
                urlArray?.length > 0 &&
                urlArray.map(
                  ({ id, name, url, interval, timeout, expectedCodes }) => (
                    <Box
                      key={id}
                      sx={{
                        py: 1,
                        px: 2,
                        bgcolor: "#FFFFFF",
                        borderRadius: 1,
                        border: "1px solid #D1DFFF",
                        animation: "fadeIn 0.3s ease-out forwards",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0px 2px 8px rgba(91, 127, 255, 0.2)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: { xs: 1.5, sm: 0 },
                        }}
                      >
                        <Box>
                          <Box display="flex" gap={1} alignItems="center">
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                bgcolor: "#0CB65A",
                                borderRadius: "50%",
                                mt: 0.5,
                              }}
                            />
                            <Typography variant="subtitle1" fontWeight="bold">
                              {name}
                            </Typography>
                            <Typography variant="subtitle1">{url}</Typography>
                          </Box>

                          <Box display="flex" gap={1}>
                            <Typography variant="subtitle1">
                              Expected codes&#58;
                            </Typography>
                            {expectedCodes.map((code, idx) => (
                              <Typography key={idx} variant="subtitle1">
                                {code}
                                {idx !== expectedCodes.length - 1 && ","}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                        <Box
                          display="flex"
                          gap={1}
                          flexWrap="wrap"
                          justifyContent="end"
                        >
                          <Typography variant="body2" color="text.secondary">
                            Interval&#58;{interval}s
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Timeout&#58;{timeout}s
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        alignItems={{ xs: "stretch", sm: "center" }}
                        gap={1.5}
                        mt={2}
                        sx={{
                          flexDirection: { xs: "column", sm: "row" },
                          width: "100%",
                          justifyContent: {
                            xs: "flex-start",
                            sm: "flex-start",
                          },
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            background:
                              "linear-gradient(90deg, #5B7FFF 0%, #7B9FFF 100%)",
                            "&:hover": {
                              background:
                                "linear-gradient(90deg, #4B6FEF 0%, #6B8FEF 100%)",
                            },
                            fontSize: "0.9rem",
                            px: 3,
                            py: 0.5,
                          }}
                          onClick={() => {
                            const item: URLObject = {
                              id,
                              name,
                              url,
                              interval,
                              timeout,
                              expectedCodes,
                            };
                            handleEditClick(item);
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="contained"
                          sx={{
                            fontSize: "0.9rem",
                            px: 3,
                            py: 0.5,
                            background: "#d32f2f",
                            "&:hover": {
                              background: "#b71c1c",
                            },
                            width: { xs: "100%", sm: "auto" },
                          }}
                          onClick={() => handleDeleteClick(id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  )
                )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default AddUrlForm;
