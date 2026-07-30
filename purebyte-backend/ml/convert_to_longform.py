"""
Convert a wide multi-label CSV into a long-form CSV with one row per (product, condition).

Usage:
    python convert_to_longform.py --input training_dataset_enhanced_template.csv \
        --output training_dataset_longform.csv

By default the script looks for columns starting with `label_condition_` and
creates rows for each condition found. It preserves other metadata columns.
"""
import argparse
import json
import pandas as pd


def detect_condition_columns(df, prefix="label_condition_"):
    return [c for c in df.columns if c.startswith(prefix)]


def wide_to_long(df, condition_cols, prefix="label_condition_"):
    rows = []
    base_cols = [c for c in df.columns if c not in condition_cols]
    for _, r in df.iterrows():
        for cond_col in condition_cols:
            condition = cond_col[len(prefix):]
            label = r.get(cond_col)
            # Skip rows where label is missing/empty
            if pd.isna(label):
                continue
            out = {c: r.get(c) for c in base_cols}
            out["condition"] = condition
            out["label_for_condition"] = int(label)
            rows.append(out)
    return pd.DataFrame(rows)


def main(input_path, output_path, prefix):
    df = pd.read_csv(input_path, dtype=str)
    # try to coerce numeric fields where sensible
    df = df.fillna("")
    condition_cols = detect_condition_columns(df, prefix)
    if not condition_cols:
        raise SystemExit(f"No condition columns found with prefix '{prefix}'")
    long_df = wide_to_long(df, condition_cols, prefix)
    # ensure a reasonable ordering
    cols = [c for c in df.columns if c not in condition_cols] + ["condition", "label_for_condition"]
    long_df = long_df[cols]
    long_df.to_csv(output_path, index=False)
    print(f"Wrote {len(long_df):,} rows to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--prefix", default="label_condition_")
    args = parser.parse_args()
    main(args.input, args.output, args.prefix)
